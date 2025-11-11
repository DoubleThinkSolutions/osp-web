<template>
  <div class="home-page">
    <ErrorState v-if="error" :error="error" @retry="retryFetch" />

    <div v-else class="main-content">
      <MapControls
        v-if="currentView === 'map'"
        @toggle-filters="showFilters = true"
        @navigate-to="handleNavigation"
        @change-style="handleStyleChange"
      />

      <MediaFilters 
        v-if="showFilters"
        @close="showFilters = false"
        @apply-filters="handleApplyFilters"
      />

      <MediaGrid 
        v-if="currentView === 'grid'"
        :media-items="mediaItems"
        @item-click="item => openModal([item])"
      />

      <MapView
        v-if="currentView === 'map'"
        ref="mapViewRef"
        :media-items="mediaItems"
        :map-style="currentMapStyle"
        @map-ready="handleMapReady"
        @map-move="handleMapMove"
        @open-modal="items => openModal(items)"
      />
    </div>

    <MediaModal
      :is-visible="isModalVisible"
      :current-item="currentModalItem"
      :total-items="modalMediaItems.length"
      :current-index="currentModalIndex"
      @close="closeModal"
      @next="nextMedia"
      @prev="prevMedia"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useMediaFetch } from '../composables/useMediaFetch';
import { useMediaModal } from '../composables/useMediaModal';

import ErrorState from '../components/ErrorState.vue';
import MediaGrid from '../components/MediaGrid.vue';
import MediaFilters from '../components/MediaFilters.vue';
import MapControls from '../components/MapControls.vue';
import MapView from '../components/MapView.vue';
import MediaModal from '../components/MediaModal.vue';

// --- NEW: Debounce utility function ---
// This function delays the execution of a function until after `wait` milliseconds
// have passed since the last time it was invoked. This is perfect for preventing
// excessive API calls while zooming or panning the map.
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// --- State Management ---
const currentView = ref('map');
const showFilters = ref(false);
const mapViewRef = ref(null);
const currentMapStyle = ref('osm');

const fetchParams = reactive({
  view: 'map',
  mapParams: null,
  filterParams: { startDate: '', endDate: '', startTime: '', endTime: '' },
});

// --- Composables ---
const { mediaItems, isFetchingMedia, error, fetchMedia } = useMediaFetch();
const { 
  isModalVisible, modalMediaItems, currentModalIndex, currentModalItem,
  openModal, closeModal, nextMedia, prevMedia
} = useMediaModal();

// --- Logic and Handlers ---
const triggerFetch = () => {
  if (currentView.value === 'map' && !fetchParams.mapParams) {
    return; // Don't fetch if map isn't ready
  }
  fetchMedia(fetchParams);
};

// --- NEW: Create a debounced version of our fetch trigger ---
// We'll call this function from handleMapMove instead of the original triggerFetch.
// A 500ms delay is a good starting point and feels responsive.
const debouncedTriggerFetch = debounce(triggerFetch, 500);

const retryFetch = () => {
  error.value = null;
  triggerFetch(); // Use the immediate fetch for an explicit user action
};

const handleMapReady = (mapInstance) => {
  const center = mapInstance.getCenter();
  const zoom = mapInstance.getZoom();
  fetchParams.mapParams = { center: { lat: center.lat, lng: center.lng }, zoom };
  triggerFetch(); // Initial fetch
};

// --- CHANGED: handleMapMove now calls the debounced function ---
const handleMapMove = (mapState) => {
  // We still update the state immediately, so any UI element
  // depending on mapParams (e.g., displaying coordinates) would be current.
  fetchParams.mapParams = { center: { lat: mapState.center.lat, lng: mapState.center.lng }, zoom: mapState.zoom };
  
  // Instead of fetching on every single move event, we call the debounced
  // version, which will only execute after the user stops moving the map.
  debouncedTriggerFetch();
};

const handleApplyFilters = (newFilters) => {
  fetchParams.filterParams = newFilters;
  triggerFetch(); // Use the immediate fetch for an explicit user action
};

const handleNavigation = ({ lat, lng }) => {
  if (mapViewRef.value) {
    // MapLibre expects [lng, lat] for coordinates
    mapViewRef.value.flyTo([lng, lat], 18);
  }
};

const handleStyleChange = (styleId) => {
  console.log('handleStyleChange called with:', styleId);
  console.log('Current style:', currentMapStyle.value);
  currentMapStyle.value = styleId;
  console.log('New style:', currentMapStyle.value);
};

// --- Watchers ---
watch(currentView, (newView) => {
  fetchParams.view = newView;
  triggerFetch();
});

onMounted(() => {
  if (currentView.value === 'grid') {
    triggerFetch();
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
