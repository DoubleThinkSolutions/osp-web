// This code runs on a separate thread.
// It has no access to the DOM, `window`, or Vue instances.
// It communicates with the main thread via messages.

self.onmessage = (event) => {
  // 1. Receive the raw media list from the main thread
  const rawMediaList = event.data;

  if (!rawMediaList) {
    self.postMessage([]); // Send back an empty array if data is invalid
    return;
  }
  
  // 2. Perform the heavy data processing and mapping logic here
  const validAndMappedMedia = rawMediaList
    .filter(item => item.id && item.capture_time && item.file_path && typeof item.lat === 'number' && typeof item.lng === 'number')
    .map(item => {

      const captureDate = item.capture_time ? new Date(item.capture_time) : null;
      
      return {
        id: item.id,
        title: `${item.file_path}`,
        thumbnailUrl: item.image_url.toLowerCase().endsWith('.mp4') ? item.thumbnail_url : item.image_url,
        fileUrl: item.image_url,
        mediaType: item.image_url.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
        // Keep the original string for display purposes in the modal
        createdAt: item.capture_time,
        // getTime() returns milliseconds. If the date is invalid, default to 0.
          createdAtTimestamp: captureDate ? captureDate.getTime() : 0,
        location: { lat: item.lat, lng: item.lng },
        // coordinates can be omitted here as MapView generates GeoJSON from `location`
        // but keeping it is fine if other parts of your app use it.
        coordinates: [item.lat, item.lng],
        orientation: item.orientation,
        trustScore: item.trust_score,
        userId: item.user_id,
        altitude: item.altitude
      }
    });
  
  // Sorting is also a good candidate for the worker thread
  validAndMappedMedia.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
  
  // 3. Send the processed, clean array back to the main thread
  self.postMessage(validAndMappedMedia);
};
