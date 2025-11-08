<template>
  <div class="grid-container">
    <div 
      class="grid-item" 
      v-for="item in mediaItems" 
      :key="item.id"
      @click="$emit('item-click', item)"
    >
      <div class="thumbnail" :style="{ backgroundImage: `url(${item.thumbnailUrl})` }"></div>
      <h3 class="title">{{ item.title }}</h3>
      <p class="created-at">Created: {{ formatDate(item.createdAt) }}</p>
      <p class="location">Location: {{ item.location?.lat?.toFixed(4) }}, {{ item.location?.lng?.toFixed(4) }}</p>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '../utils/dateUtils';

defineProps({
  mediaItems: {
    type: Array,
    required: true
  }
});
defineEmits(['item-click']);
</script>
<style scoped>
.grid-container {
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  padding: 80px 20px 20px 20px;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  box-sizing: border-box;
}

.grid-item {
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: fit-content;
}

.grid-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.thumbnail {
  width: 100%;
  height: 180px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-size: cover;
  background-position: center;
}

.title, .created-at, .location {
  margin: 0.25rem 0;
  color: #666;
}
.title { font-size: 1.1rem; color: #333; }
</style>
