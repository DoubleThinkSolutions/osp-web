<template>
  <div class="top-right-controls">
    <div class="navigate-container">
      <input 
        v-model="coordInput"
        type="text" 
        placeholder="Lat, Lng"
        @keyup.enter="navigateToCoordinate"
      />
      <button @click="navigateToCoordinate">Go</button>
    </div>
    <button @click="$emit('toggle-filters')" class="filter-toggle-btn" title="Open Filters">
      <img src="../assets/icons/filter_icon.svg" alt="Filter" class="icon" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['navigate-to', 'toggle-filters']);
const coordInput = ref('');

const navigateToCoordinate = () => {
  const trimmedInput = coordInput.value.trim();
  if (!trimmedInput) return alert("Please enter coordinates.");

  const parts = trimmedInput.split(/[\s,]+/);
  if (parts.length !== 2) return alert("Invalid format. Use 'Lat, Lng'.");

  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return alert("Invalid coordinates.");
  }

  emit('navigate-to', { lat, lng });
};
</script>
<style scoped>
.top-right-controls {
  position: absolute;
  top: var(--header-inset);
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.navigate-container {
  display: flex;
  background-color: var(--background-glass);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.navigate-container input {
  padding: 10px 15px;
  border: none;
  font-size: 0.9rem;
  outline: none;
  background-color: transparent;
}

.navigate-container button {
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  border-left: 1px solid var(--border-color);
}

.navigate-container button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.filter-toggle-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background-color: var(--background-glass);
  backdrop-filter: blur(10px);
  color: var(--text-color-dark);
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.filter-toggle-btn .icon {
  width: 20px;
  height: 20px;
}

.filter-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}
</style>
