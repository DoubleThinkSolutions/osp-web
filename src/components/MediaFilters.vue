<template>
  <div class="filter-overlay">
    <div class="filter-panel">
      <div class="filter-header">
        <h3>Filter by Date & Time</h3>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      <div class="filter-content">
        <div class="filter-row">
          <div class="filter-group">
            <label for="start-date">Start Date</label>
            <input type="date" id="start-date" v-model="localFilters.startDate" />
          </div>
          <div class="filter-group">
            <label for="end-date">End Date</label>
            <input type="date" id="end-date" v-model="localFilters.endDate" />
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-group">
            <label for="start-time">Start Time</label>
            <input type="time" id="start-time" v-model="localFilters.startTime" />
          </div>
          <div class="filter-group">
            <label for="end-time">End Time</label>
            <input type="time" id="end-time" v-model="localFilters.endTime" />
          </div>
        </div>
        <div class="filter-actions">
          <button @click="clear" class="clear-button">Clear</button>
          <button @click="apply" class="filter-button">Apply Filters</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['apply-filters', 'close']);

const localFilters = ref({
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: ''
});

const clear = () => {
  localFilters.value = { startDate: '', endDate: '', startTime: '', endTime: '' };
  emit('apply-filters', localFilters.value);
  emit('close');
};

const apply = () => {
  emit('apply-filters', { ...localFilters.value });
  emit('close');
};
</script>
<style scoped>
.filter-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.filter-panel {
  background-color: var(--background-glass-light);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 0;
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.filter-header h3 { margin: 0; }

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}
.close-btn:hover { background-color: #f0f0f0; }

.filter-content { padding: 20px 24px 24px; }
.filter-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
.filter-group { flex: 1; display: flex; flex-direction: column; }
.filter-group label { font-size: 0.9rem; color: #555; margin-bottom: 0.5rem; }

.filter-group input {
  padding: 12px;
  border: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  transition: all 0.2s ease;
}
.filter-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

.filter-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.clear-button {
  padding: 12px 24px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background-color: transparent;
  color: var(--text-color-dark);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.clear-button:hover { background-color: rgba(0, 0, 0, 0.05); }

@media (max-width: 768px) {
  .filter-row { flex-direction: column; }
}
</style>
