import { ref, computed } from 'vue';

export function useMediaModal() {
  const isModalVisible = ref(false);
  const modalMediaItems = ref([]);
  const currentModalIndex = ref(0);

  const currentModalItem = computed(() => {
    return modalMediaItems.value.length > 0
      ? modalMediaItems.value[currentModalIndex.value]
      : null;
  });

  const openModal = (items, startIndex = 0) => {
    if (!items || items.length === 0) return;
    modalMediaItems.value = items;
    currentModalIndex.value = startIndex;
    isModalVisible.value = true;
  };

  const closeModal = () => {
    isModalVisible.value = false;
    // Delay clearing to allow for close animation
    setTimeout(() => {
      modalMediaItems.value = [];
      currentModalIndex.value = 0;
    }, 300);
  };

  const nextMedia = () => {
    if (modalMediaItems.value.length > 1) {
      currentModalIndex.value = (currentModalIndex.value + 1) % modalMediaItems.value.length;
    }
  };

  const prevMedia = () => {
    if (modalMediaItems.value.length > 1) {
      currentModalIndex.value = (currentModalIndex.value - 1 + modalMediaItems.value.length) % modalMediaItems.value.length;
    }
  };
  
  return {
    isModalVisible,
    modalMediaItems,
    currentModalIndex,
    currentModalItem,
    openModal,
    closeModal,
    nextMedia,
    prevMedia,
  };
}
