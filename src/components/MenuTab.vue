<!-- src/components/MenuTab.vue -->
<template>

  <div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around p-4 pb-12">
    <button @click="setMode('search')" class="focus:outline-none">
      <i class="fas fa-search text-3xl" :class="currentMode == 'search' ? 'text-blue-400' : 'text-gray-400'"></i>
    </button>
    <button @click="setMode('myList')" class="focus:outline-none">
      <i class="fa-solid fa-list text-3xl" :class="currentMode == 'myList' ? 'text-blue-400' : 'text-gray-400'"></i>
    </button>
    <button @click="setMode('bookShelf')" class="focus:outline-none">
      <i class="fa-solid fa-book text-3xl" :class="currentMode == 'bookShelf' ? 'text-blue-400' : 'text-gray-400'"></i>
    </button>
  </div>
</template>

<script>
import { useBookStore } from '@/stores/bookStore';
import { computed } from 'vue';

export default {
    setup() {
        const store = useBookStore();

        const setMode = async (mode) => {
            store.currentMode = mode;
            if (mode === 'myList' || mode ==='bookShelf') {
                await store.fetchSpreadSheetData();
                store.displayingData = store.myBookList;
            } else {
                store.hasSearched = false;
                store.currentMode = mode;
                store.displayingData = [];
            }
        };
        // Expose currentMode to the template
        return { 
          setMode, 
          currentMode: computed(() => store.currentMode) // Make currentMode reactive
        };
    },
};
</script>

