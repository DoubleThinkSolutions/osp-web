<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button @click="$emit('close')" class="modal-close-btn">×</button>

      <template v-if="currentItem">
        <div class="modal-image-container">
          <div class="media-type-badge">{{ currentItem.mediaType }}</div>
          <img
            v-if="currentItem.mediaType === 'image'"
            :key="currentItem.id"
            :src="currentItem.fileUrl"
            :alt="currentItem.title"
            class="modal-image"
          />
          <video
            v-if="currentItem.mediaType === 'video'"
            :key="currentItem.id"
            :src="currentItem.fileUrl"
            :poster="currentItem.thumbnailUrl"
            class="modal-image"
            controls preload="metadata" muted autoplay
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div class="modal-info">
          <div class="info-header">
            <h2>{{ extractFileName(currentItem.title) }}</h2>
            <div class="trust-badge" :class="getTrustClass(currentItem.trustScore)">
              <span class="trust-label">Trust Score</span>
              <span class="trust-value">{{ currentItem.trustScore ?? 'N/A' }}</span>
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">Capture Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Date</span>
                <span class="info-value">{{ formatDate(currentItem.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Time</span>
                <span class="info-value">{{ formatTime(currentItem.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Type</span>
                <span class="info-value media-type">{{ currentItem.mediaType }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">File ID</span>
                <span class="info-value file-id">{{ currentItem.id.substring(0, 8) }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">Location Details</h3>
            <div class="info-grid">
              <div class="info-item full-width">
                <span class="info-label">Coordinates</span>
                <span class="info-value coordinates">
                  {{ currentItem.location.lat.toFixed(6) }}°N, {{ currentItem.location.lng.toFixed(6) }}°E
                </span>
              </div>
            </div>
          </div>

          <div v-if="currentItem.orientation" class="info-section">
            <h3 class="section-title">Orientation</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Azimuth</span>
                <span class="info-value">{{ currentItem.orientation.azimuth }}°</span>
              </div>
              <div class="info-item">
                <span class="info-label">Pitch</span>
                <span class="info-value">{{ currentItem.orientation.pitch }}°</span>
              </div>
              <div class="info-item">
                <span class="info-label">Roll</span>
                <span class="info-value">{{ currentItem.orientation.roll }}°</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">Metadata</h3>
            <div class="info-grid">
              <div class="info-item full-width">
                <span class="info-label">User ID</span>
                <span class="info-value user-id">{{ currentItem.userId }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">File Path</span>
                <span class="info-value file-path">{{ currentItem.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="totalItems > 1">
        <button @click="$emit('prev')" class="modal-nav-btn prev" title="Previous">‹</button>
        <button @click="$emit('next')" class="modal-nav-btn next" title="Next">›</button>
        <div class="modal-counter">{{ currentIndex + 1 }} / {{ totalItems }}</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '../utils/DateUtils';

defineProps({
  isVisible: Boolean,
  currentItem: Object,
  totalItems: Number,
  currentIndex: Number,
});
defineEmits(['close', 'next', 'prev']);

// Format time separately from date
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

// Extract filename from full path
const extractFileName = (filePath) => {
  if (!filePath) return 'Untitled';
  const parts = filePath.split(/[/\\]/);
  return parts[parts.length - 1] || filePath;
};

// Get CSS class based on trust score
const getTrustClass = (score) => {
  if (score === null || score === undefined) return 'trust-unknown';
  if (score >= 0.8) return 'trust-high';
  if (score >= 0.5) return 'trust-medium';
  return 'trust-low';
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.25s ease-out;
  backdrop-filter: blur(4px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  padding: 0;
  width: 92vw;
  height: 92vh;
  max-width: 1800px;
  max-height: 1000px;
  display: flex;
  gap: 0;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-image-container {
  flex: 2.5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  position: relative;
  overflow: hidden;
}

.media-type-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.modal-info {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  background-color: #fafafa;
}

.modal-info::-webkit-scrollbar {
  width: 8px;
}

.modal-info::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-info::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.modal-info::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.info-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  max-width: 60%;
  word-break: break-word;
}

.trust-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 16px;
  border-radius: 10px;
  min-width: 90px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.trust-badge.trust-high {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.trust-badge.trust-medium {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.trust-badge.trust-low {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.trust-badge.trust-unknown {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}

.trust-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.trust-value {
  font-size: 20px;
  font-weight: 700;
}

.info-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
  margin: 0 0 14px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e5e5;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: white;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;
}

.info-item:hover {
  border-color: #d1d1d1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.info-item.full-width {
  grid-column: span 2;
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  word-break: break-all;
}

.info-value.coordinates {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #2563eb;
}

.info-value.media-type {
  text-transform: capitalize;
  color: #7c3aed;
}

.info-value.file-id {
  font-family: 'Courier New', monospace;
  color: #059669;
}

.info-value.user-id {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #dc2626;
}

.info-value.file-path {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #4b5563;
  word-break: break-all;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  font-size: 28px;
  color: white;
  cursor: pointer;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.modal-close-btn:hover {
  background-color: rgba(0, 0, 0, 0.85);
}

.modal-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  font-size: 28px;
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 100;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-nav-btn:hover {
  background-color: rgba(0, 0, 0, 0.85);
  transform: translateY(-50%) scale(1.1);
}

.modal-nav-btn.prev { left: 24px; }
.modal-nav-btn.next { right: 24px; }

.modal-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  z-index: 100;
  backdrop-filter: blur(10px);
}

@media (max-width: 1024px) {
  .modal-content {
    flex-direction: column;
    height: 95vh;
  }

  .modal-image-container {
    flex: 1;
    max-height: 50vh;
  }

  .modal-info {
    flex: 1;
    padding: 24px;
  }

  .info-header h2 {
    font-size: 18px;
    max-width: 50%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item.full-width {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .modal-content {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    max-width: none;
    max-height: none;
  }

  .modal-info {
    padding: 20px;
  }

  .info-header {
    flex-direction: column;
    gap: 16px;
  }

  .info-header h2 {
    max-width: 100%;
    font-size: 16px;
  }

  .trust-badge {
    align-self: flex-start;
  }
}
</style>
