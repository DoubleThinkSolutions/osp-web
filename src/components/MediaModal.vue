<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button @click="$emit('close')" class="modal-close-btn">×</button>

      <template v-if="currentItem">
        <div class="modal-image-container">
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
          <h3>{{ currentItem.title }}</h3>
          <p><strong>Captured:</strong> {{ formatDate(currentItem.createdAt) }}</p>
          <p><strong>Location:</strong> {{ currentItem.location.lat.toFixed(6) }}, {{ currentItem.location.lng.toFixed(6) }}</p>
          <p v-if="currentItem.orientation">
            <strong>Orientation:</strong>
            Azimuth: {{ currentItem.orientation.azimuth }},
            Pitch: {{ currentItem.orientation.pitch }},
            Roll: {{ currentItem.orientation.roll }}
          </p>
          <p><strong>Trust Score:</strong> {{ currentItem.trustScore ?? 'N/A' }}</p>
          <p><strong>User ID:</strong> {{ currentItem.userId }}</p>
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
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90vw;
  height: 90vh;
  max-width: 1600px;
  display: flex;
  gap: 2rem;
  position: relative;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-image-container {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.modal-info {
  flex: 1;
  overflow-y: auto;
  padding-right: 15px;
}

.modal-info h3 { margin-top: 0; }
.modal-info p { margin: 0.8rem 0; }

.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  color: #666;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.2s ease;
}
.modal-close-btn:hover { background-color: #f0f0f0; }

.modal-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0,0,0,0.4);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.modal-nav-btn:hover { background-color: rgba(0,0,0,0.7); }
.modal-nav-btn.prev { left: 20px; }
.modal-nav-btn.next { right: 20px; }

.modal-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0,0,0,0.6);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .modal-content { flex-direction: column; padding: 1.5rem; }
  .modal-image-container { max-height: 50vh; }
  .modal-info { flex: none; max-height: 35vh; }
}
</style>
