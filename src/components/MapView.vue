<template>
  <div class="map-container content-area">
    <div ref="mapContainer" class="map-container-inner"></div>

    <div v-if="hoveredMediaItem" class="hover-preview">
      <img :src="hoveredMediaItem.thumbnailUrl" :alt="hoveredMediaItem.title" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const props = defineProps({
  mediaItems: { type: Array, required: true },
});
const emit = defineEmits(['map-move', 'map-ready', 'open-modal']);

const mapContainer = ref(null);
const map = ref(null);
const hoveredMediaItem = ref(null);

// Create a lookup map for faster access to media items by ID.
// This is more efficient than filtering the array every time.
const mediaItemsById = computed(() => {
  return new Map(props.mediaItems.map(item => [item.id, item]));
});

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

// --- NEW: Helper function to parse feature properties ---
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


onMounted(() => {
  const style = {
    version: 8,
    sources: { osm: { type: 'raster', tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '&copy; OpenStreetMap' } },
    layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }]
  };

  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: style,
    center: [0, 0],
    zoom: 1,
    minZoom: 2,
    worldCopyJump: true,
  });

  map.value.on('load', () => {
    map.value.addSource('media', {
      type: 'geojson',
      data: mediaGeoJSON.value,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      // Add a cluster property to store the ID of the most recent item.
      // This is an optimization for hover previews.
      clusterProperties: {
            // --- CHANGED: Use the new numeric timestamp property ---
            mostRecentCreatedAt: ['max', ['get', 'createdAtTimestamp']],
        }
    });

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

    map.value.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'media',
      filter: ['has', 'point_count'],
      layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'], 'text-size': 12 }
    });

    map.value.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'media',
      filter: ['!', ['has', 'point_count']],
      paint: { 'circle-color': '#11b4da', 'circle-radius': 6, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' }
    });
    
    setupMapEvents();
    emit('map-ready', map.value);
  });
});

const setupMapEvents = () => {
  const mapInstance = map.value;
  if (!mapInstance) return;

  mapInstance.on('moveend', onMapMove);
  mapInstance.on('zoomend', onMapMove);

  // --- CORRECTED: Cluster Click Handling ---
  mapInstance.on('click', 'clusters', (e) => {
    const clusterId = e.features[0].properties.cluster_id;
    const source = mapInstance.getSource('media');

    source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
      if (err) return console.error('Error getting cluster leaves:', err);
      
      // Get the IDs from the leaves
      const itemIds = new Set(leaves.map(leaf => leaf.properties.id));
      
      // Look up the full, original objects from props
      const fullItems = props.mediaItems.filter(item => itemIds.has(item.id));
      
      if (fullItems.length > 0) {
        emit('open-modal', fullItems);
      }
    });
  });

  // Unclustered point click handler (remains the same and works)
  mapInstance.on('click', 'unclustered-point', (e) => {
    const item = parseFeatureProperties(e.features[0].properties);
    emit('open-modal', [item]);
  });
  
  const interactiveLayers = ['clusters', 'unclustered-point'];
  interactiveLayers.forEach(layerId => {
    mapInstance.on('mouseenter', layerId, (e) => {
      mapInstance.getCanvas().style.cursor = 'pointer';

      if (layerId === 'clusters') {
        // --- CORRECTED: Cluster Hover Handling ---
        const clusterId = e.features[0].properties.cluster_id;
        const source = mapInstance.getSource('media');

        source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
          if (err) return;

          // Get IDs and find the full items from props
          const itemIds = new Set(leaves.map(leaf => leaf.properties.id));
          const fullItemsInCluster = props.mediaItems.filter(item => itemIds.has(item.id));

          if (fullItemsInCluster.length > 0) {
            // Find the most recent item from the full, correctly-structured objects
            const mostRecentItem = fullItemsInCluster.reduce((latest, current) => 
              new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );
            hoveredMediaItem.value = mostRecentItem;
          }
        });

      } else {
        // Unclustered point hover (remains the same and works)
        hoveredMediaItem.value = parseFeatureProperties(e.features[0].properties);
      }
    });

    mapInstance.on('mouseleave', layerId, () => {
      mapInstance.getCanvas().style.cursor = '';
      hoveredMediaItem.value = null;
    });
  });
};

onUnmounted(() => {
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

const onMapMove = () => {
  if (!map.value) return;
  const center = map.value.getCenter();
  const zoom = map.value.getZoom();
  emit('map-move', { center, zoom });
};

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

.hover-preview {
  position: absolute;
  bottom: 30px;
  left: 20px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px;
  pointer-events: none;
  max-width: 200px;
  transition: opacity 0.2s ease-in-out;
}

.hover-preview img {
  max-width: 180px;
  max-height: 150px;
  border-radius: 4px;
  display: block;
}
</style>
