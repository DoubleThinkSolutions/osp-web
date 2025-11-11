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
    <button @click="toggleStyleMenu" class="style-toggle-btn" title="Change Map Style">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    </button>
    <div v-if="showStyleMenu" class="style-menu">
      <button
        v-for="style in mapStyles"
        :key="style.id"
        @click="selectStyle(style.id)"
        :class="{ active: currentStyle === style.id }"
        class="style-option"
      >
        {{ style.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['navigate-to', 'toggle-filters', 'change-style']);
const coordInput = ref('');
const showStyleMenu = ref(false);
const currentStyle = ref('osm');

const mapStyles = [
  { id: 'osm', name: 'Street' },
  { id: 'satellite', name: 'Satellite' },
];

const toggleStyleMenu = () => {
  showStyleMenu.value = !showStyleMenu.value;
};

const selectStyle = (styleId) => {
  console.log('selectStyle called with:', styleId);
  currentStyle.value = styleId;
  showStyleMenu.value = false;
  console.log('Emitting change-style event with:', styleId);
  emit('change-style', styleId);
};

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
  top: 10px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.navigate-container {
  display: flex;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(0, 0, 0, 0.1);
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
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
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

.style-toggle-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  color: var(--text-color-dark);
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.style-toggle-btn .icon {
  width: 20px;
  height: 20px;
}

.style-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.style-menu {
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 140px;
}

.style-option {
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background-color: transparent;
  color: var(--text-color-dark);
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.style-option:last-child {
  border-bottom: none;
}

.style-option:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.style-option.active {
  background-color: rgba(37, 99, 235, 0.15);
  color: #2563eb;
  font-weight: 500;
}
</style>
