<!-- src/components/MenuTab.vue -->
<template>

  <div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around p-4">
    <button @click="setMode('search')" class="focus:outline-none">
      <i class="fas fa-search text-3xl" :class="currentMode == 'search' ? 'text-blue-400' : 'text-gray-400'"></i>
    </button>
    <button @click="setMode('myList')" class="focus:outline-none">
      <i class="fa-solid fa-list text-3xl" :class="currentMode == 'myList' ? 'text-blue-400' : 'text-gray-400'"></i>
    </button>
  </div>
</template>

<script>
import { useBookStore } from '@/stores/bookStore';

export default {
    setup() {
        const store = useBookStore();
        const setMode = (mode) => {
            store.currentMode = mode;
            if (mode === 'myList') {
              console.log('rest');
                store.displayingData = store.myBookList;
            } else {
                store.displayingData = [];
            }
        };
        // Expose currentMode to the template
        return { setMode, currentMode: store.currentMode };
    },
};
</script>

