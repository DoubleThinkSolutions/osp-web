import { ref, onUnmounted } from 'vue';
import MediaProcessorWorker from '../workers/mediaProcessor.worker.js?worker';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility functions moved from the component
const getRadiusFromZoom = (zoom) => {
  const maxRadius = 120600000;
  const minRadius = 25;
  const offset = 5;
  const offsetZoom = Math.max(0, zoom - offset);
  const calculatedRadius = maxRadius / Math.pow(2, offsetZoom);
  return Math.max(minRadius, calculatedRadius);
};

const normalizeLongitude = (lng) => {
  lng = lng % 360;
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;
  return lng;
};

const normalizeLatitude = (lat) => {
  return Math.max(-90, Math.min(90, lat));
};

export function useMediaFetch() {
  const mediaItems = ref([]);
  const isFetchingMedia = ref(false);
  const error = ref(null);

  // --- NEW: Instantiate the worker ---
  const worker = new MediaProcessorWorker();

  // --- NEW: Set up a listener for messages FROM the worker ---
  worker.onmessage = (event) => {
    // The worker has finished processing and sent the data back.
    // Now we update the reactive ref. This is the only part that
    // touches the main thread with the large data set.
    mediaItems.value = event.data;
    
    // We can also signal that the entire process is finished
    isFetchingMedia.value = false;
  };

  worker.onerror = (err) => {
    console.error('Error in media processor worker:', err);
    error.value = "Failed to process media data.";
    isFetchingMedia.value = false;
  }

  const fetchMedia = async ({ view, mapParams, filterParams }) => {
    try {
      isFetchingMedia.value = true;
      error.value = null;
      const queryParams = new URLSearchParams();

      if (view === 'map' && mapParams) {
        const radius = getRadiusFromZoom(mapParams.zoom);
        queryParams.append('lat', normalizeLatitude(mapParams.center.lat).toString());
        queryParams.append('lng', normalizeLongitude(mapParams.center.lng).toString());
        queryParams.append('radius', radius.toString());
      } else {
        // Default for grid view or if map isn't ready
        queryParams.append('lat', '0');
        queryParams.append('lng', '0');
        queryParams.append('radius', '2000000000');
      }

      // Append filter params
      const startDate = filterParams.startDate 
        ? new Date(`${filterParams.startDate}T${filterParams.startTime || '00:00:00'}`).toISOString()
        : new Date('0001-01-01T00:00:00Z').toISOString();
      queryParams.append('start_date', startDate);
      
      const endDate = filterParams.endDate
        ? new Date(`${filterParams.endDate}T${filterParams.endTime || '23:59:59'}`).toISOString()
        : new Date('9999-12-31T23:59:59Z').toISOString();
      queryParams.append('end_date', endDate);
      
      console.log(`Fetching media with params: ${queryParams.toString()}`);
      const response = await fetch(`${API_BASE_URL}/media?${queryParams.toString()}`, {
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.detail || 'Unknown error'}`);
      }
      
      const data = await response.json();
      const mediaList = data.media || [];

      worker.postMessage(mediaList);

    } catch (err) {
      console.error('Error fetching media:', err);
      mediaItems.value = [];
      error.value = err.message || "Failed to load media. Please try again.";
      isFetchingMedia.value = false;
    }
  };

  onUnmounted(() => {
    worker.terminate();
  });

  return {
    mediaItems,
    isFetchingMedia,
    error,
    fetchMedia,
  };
}
