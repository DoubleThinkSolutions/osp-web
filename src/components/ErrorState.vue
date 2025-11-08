<template>
  <div class="error-container">
    <p class="error-message">{{ error }}</p>
    <button @click="$emit('retry')" class="button">Retry</button>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    required: true
  }
});
defineEmits(['retry']);
</script>
<style scoped>
.error-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: var(--background-glass-light);
  backdrop-filter: blur(16px);
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 1rem;
}
</style>
