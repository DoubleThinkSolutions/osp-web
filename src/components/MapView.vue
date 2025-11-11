<template>
  <div class="map-container content-area">
    <div ref="mapContainer" class="map-container-inner"></div>

    <div
      v-if="hoveredMediaItem"
      class="hover-tooltip"
      :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }"
    >
      <div class="tooltip-image">
        <img :src="hoveredMediaItem.thumbnailUrl" :alt="hoveredMediaItem.title" />
      </div>
      <div class="tooltip-details">
        <div class="tooltip-row">
          <span class="tooltip-label">Type:</span>
          <span class="tooltip-value">{{ hoveredMediaItem.mediaType }}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Time:</span>
          <span class="tooltip-value">{{ formatTooltipDate(hoveredMediaItem.createdAt) }}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Trust:</span>
          <span class="tooltip-value">{{ hoveredMediaItem.trustScore ?? 'N/A' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const props = defineProps({
  mediaItems: { type: Array, required: true },
  mapStyle: { type: String, default: 'osm' },
});
const emit = defineEmits(['map-move', 'map-ready', 'open-modal']);

const mapContainer = ref(null);
const map = ref(null);
const hoveredMediaItem = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });

// Create a lookup map for faster access to media items by ID.
// This is more efficient than filtering the array every time.
const mediaItemsById = computed(() => {
  return new Map(props.mediaItems.map(item => [item.id, item]));
});

// Format date for tooltip display
const formatTooltipDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Track mouse position for tooltip
const updateTooltipPosition = (e) => {
  const offset = 20; // Offset above cursor
  const tooltipWidth = 240; // Approximate tooltip width
  const tooltipHeight = 200; // Approximate tooltip height

  let x = e.point.x + 15;
  let y = e.point.y - tooltipHeight - offset;

  // Keep tooltip within viewport
  if (x + tooltipWidth > window.innerWidth) {
    x = e.point.x - tooltipWidth - 15;
  }
  if (y < 0) {
    y = e.point.y + offset;
  }

  tooltipPosition.value = { x, y };
};

const mapStyles = {
  osm: {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: { osm: { type: 'raster', tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '&copy; OpenStreetMap' } },
    layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }]
  },
  satellite: {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      satellite: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: '&copy; Esri'
      }
    },
    layers: [{ id: 'satellite-tiles', type: 'raster', source: 'satellite' }]
  },
};

const mediaGeoJSON = computed(() => ({
  type: "FeatureCollection",
  features: props.mediaItems.map(item => ({
    type: "Feature",
    // GeoJSON features need a unique id, which can be a number.
    // We can use the item's own ID, but since it's a string, we'll let MapLibre handle it.
    // We add the original ID to properties for our lookup.
    properties: {
      ...item // Pass all original item data
    },
    geometry: {
      type: "Point",
      coordinates: [item.location.lng, item.location.lat]
    }
  }))
}));

// --- Helper function to parse feature properties ---
// MapLibre stringifies nested objects in properties. This function safely parses them back.
const parseFeatureProperties = (props) => {
  const parsedProps = { ...props };
  for (const key in parsedProps) {
    if (typeof parsedProps[key] === 'string' && (parsedProps[key].startsWith('{') || parsedProps[key].startsWith('['))) {
      try {
        parsedProps[key] = JSON.parse(parsedProps[key]);
      } catch (e) {
        // Not valid JSON, leave as is
      }
    }
  }
  return parsedProps;
};

// Function to add the sources and layers. It assumes the style is loaded.
const addDataToMap = () => {
  if (!map.value) return;

  const mapInstance = map.value;

  // Add source if it doesn't exist
  if (!mapInstance.getSource('media')) {
    mapInstance.addSource('media', {
      type: 'geojson',
      data: mediaGeoJSON.value,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });
  }

  // Add layers if they don't exist
  if (!mapInstance.getLayer('clusters')) {
    mapInstance.addLayer({
      id: 'clusters', type: 'circle', source: 'media', filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
      }
    });
  }
  if (!mapInstance.getLayer('cluster-count')) {
    mapInstance.addLayer({
      id: 'cluster-count', type: 'symbol', source: 'media', filter: ['has', 'point_count'],
      layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['Noto Sans Regular'], 'text-size': 12 }
    });
  }
  if (!mapInstance.getLayer('unclustered-point')) {
    mapInstance.addLayer({
      id: 'unclustered-point', type: 'circle', source: 'media', filter: ['!', ['has', 'point_count']],
      paint: { 'circle-color': '#11b4da', 'circle-radius': 6, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' }
    });
  }
};

// Function to attach event listeners. Separated for clarity.
const setupMapEvents = () => {
  if (!map.value) return;
  const mapInstance = map.value;

  // First, remove any lingering listeners to prevent duplicates
  cleanupMapEvents();

  mapInstance.on('moveend', onMapMove);
  mapInstance.on('zoomend', onMapMove);

  mapInstance.on('click', 'clusters', handleClusterClick);
  mapInstance.on('click', 'unclustered-point', handlePointClick);

  mapInstance.on('mouseenter', 'clusters', handleClusterMouseEnter);
  mapInstance.on('mouseleave', 'clusters', handleMouseLeave);
  mapInstance.on('mouseenter', 'unclustered-point', handlePointMouseEnter);
  mapInstance.on('mouseleave', 'unclustered-point', handleMouseLeave);
};

// Function to remove all our custom listeners. CRITICAL for style changes.
const cleanupMapEvents = () => {
  if (!map.value) return;
  const mapInstance = map.value;
  
  // Note: We need to pass the function reference to .off()
  mapInstance.off('moveend', onMapMove);
  mapInstance.off('zoomend', onMapMove);

  mapInstance.off('click', 'clusters', handleClusterClick);
  mapInstance.off('click', 'unclustered-point', handlePointClick);

  mapInstance.off('mouseenter', 'clusters', handleClusterMouseEnter);
  mapInstance.off('mouseleave', 'clusters', handleMouseLeave);
  mapInstance.off('mouseenter', 'unclustered-point', handlePointMouseEnter);
  mapInstance.off('mouseleave', 'unclustered-point', handleMouseLeave);
};

// Function to add media layers to the map
const addMediaLayers = () => {
  if (!map.value) return;

  // Add the media source
  if (!map.value.getSource('media')) {
    map.value.addSource('media', {
      type: 'geojson',
      data: mediaGeoJSON.value,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      clusterProperties: {
        mostRecentCreatedAt: ['max', ['get', 'createdAtTimestamp']],
      }
    });
  }

  if (!map.value.getLayer('clusters')) {
    // Add cluster layer
    map.value.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'media',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
      }
    });

    // Add cluster count layer
    map.value.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'media',
      filter: ['has', 'point_count'],
      layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['Noto Sans Regular'], 'text-size': 12 }
    });

    // Add unclustered point layer
    map.value.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'media',
      filter: ['!', ['has', 'point_count']],
      paint: { 'circle-color': '#11b4da', 'circle-radius': 6, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' }
    });
  }

  // Setup event handlers
  setupMapEvents();
};

// --- Event Handlers (extracted from setupMapEvents for .on()/.off()) ---

const onMapMove = () => {
  if (!map.value) return;
  const center = map.value.getCenter();
  const zoom = map.value.getZoom();
  emit('map-move', { center, zoom });
};

const handleClusterClick = (e) => {
  const features = map.value.queryRenderedFeatures(e.point, { layers: ['clusters'] });
  const clusterId = features[0].properties.cluster_id;
  map.value.getSource('media').getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) return;
    map.value.easeTo({ center: features[0].geometry.coordinates, zoom: zoom });
  });
};

const handlePointClick = (e) => {
  const item = parseFeatureProperties(e.features[0].properties);
  emit('open-modal', [item]);
};

const handleClusterMouseEnter = (e) => {
    map.value.getCanvas().style.cursor = 'pointer';
    updateTooltipPosition(e);
    const clusterId = e.features[0].properties.cluster_id;
    const source = map.value.getSource('media');

    source.getClusterLeaves(clusterId, 1, 0, (err, leaves) => {
        if (err || !leaves || leaves.length === 0) return;
        // Show a preview of the first item in the cluster
        hoveredMediaItem.value = parseFeatureProperties(leaves[0].properties);
    });
};

const handlePointMouseEnter = (e) => {
    map.value.getCanvas().style.cursor = 'pointer';
    updateTooltipPosition(e);
    hoveredMediaItem.value = parseFeatureProperties(e.features[0].properties);
};

const handleMouseLeave = () => {
    map.value.getCanvas().style.cursor = '';
    hoveredMediaItem.value = null;
};

onMounted(() => {
  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: mapStyles[props.mapStyle],
    center: [0, 0],
    zoom: 1,
  });

  map.value.on('load', () => {
    console.log('Initial map load complete.');
    addDataToMap();
    setupMapEvents();
    emit('map-ready', map.value);
  });
});

onUnmounted(() => {
  cleanupMapEvents(); // Clean up listeners
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});

watch(mediaGeoJSON, (newGeoJSON) => {
  if (map.value && map.value.isStyleLoaded() && map.value.getSource('media')) {
    map.value.getSource('media').setData(newGeoJSON);
  }
});

watch(() => props.mapStyle, (newStyle) => {
  if (!map.value || !mapStyles[newStyle]) return;

  console.log('Style change requested:', newStyle);
  
  const center = map.value.getCenter();
  const zoom = map.value.getZoom();
  const bearing = map.value.getBearing();
  const pitch = map.value.getPitch();

  // We create a deep copy of the style object to ensure MapLibre treats it as a completely new style.
  const newStyleObject = JSON.parse(JSON.stringify(mapStyles[newStyle]));
  
  // The { diff: false } option can also help by forcing a full reload, preventing any smart-diffing that might be causing issues.
  map.value.setStyle(newStyleObject, { diff: false });

  // Now, the 'style.load' event will fire correctly because the map is truly loading a new style.
  map.value.once('style.load', () => {
    console.log('SUCCESS: New style finished loading. Re-adding data.');
    
    map.value.setCenter(center);
    map.value.setZoom(zoom);
    map.value.setBearing(bearing);
    map.value.setPitch(pitch);

    // Use your existing functions to re-add data and events
    // (The refactored functions from the previous answer are perfect for this)
    addDataToMap(); 
    setupMapEvents();
  });
});

// Expose flyTo method
const flyTo = (coords, zoom) => {
  if (map.value) {
    map.value.flyTo({ center: coords, zoom: zoom, speed: 1.5 });
  }
};
defineExpose({ flyTo });

</script>

<style scoped>
.map-container {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}

.map-container-inner {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.hover-tooltip {
  position: absolute;
  z-index: 1000;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  width: 240px;
  overflow: hidden;
  animation: tooltipFadeIn 0.2s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tooltip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tooltip-details {
  padding: 12px;
  background-color: white;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
}

.tooltip-row:last-child {
  margin-bottom: 0;
}

.tooltip-label {
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.tooltip-value {
  color: #222;
  font-weight: 500;
  text-align: right;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
