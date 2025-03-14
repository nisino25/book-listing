<template>
  <template v-if="store.currentMode == 'bookShelf'">
    <span>{{ displayingData?.length }}</span>
    <div class="p-4">
      <div v-if="store.displayingData?.length > 0 && !store.isLoading" 
        class="flex gap-2 p-4 bookshelf"
      >
        <template v-for="item in store.displayingData" :key="item.id">
          <div 
            class="book-spine relative" 
            :style="{ backgroundColor: getBookColor(item) }"
          >
            <span class="book-title">
              {{ store.currentMode === 'search' ? item?.volumeInfo?.title : item?.title }}
            </span>
          </div>
        </template>
      </div>
  
      <!-- No Results Message -->
      <div v-else-if="store.currentMode === 'bookShelf' && store.hasSearched && !isLoading" 
        class="text-center text-lg font-medium my-4">
        <h5>見つかりませんでした。</h5>
      </div>
  
      <!-- Loading Animation -->
      <div v-if="store.displayingData?.length == 0 && store.isLoading" 
        class="text-center fixed left-1/2 top-[35%] transform -translate-x-1/2 -translate-y-1/2">
        <div class="relative w-[22.5vw] aspect-square m-8">
            <div class="absolute w-[80%] h-[80%] border-4 border-indigo-300 rounded-full animate-[ripple_1.5s_infinite] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute w-[80%] h-[80%] border-4 border-indigo-300 rounded-full animate-[ripple_1.5s_infinite] [animation-delay:0.5s] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  </template>

</template>

<script>
import { useBookStore } from '@/stores/bookStore';

export default {
  name: 'BookResult',
  setup() {
    const store = useBookStore();

    // Function to generate a random pastel color for book spines
    const getBookColor = (item) => {
      const colors = ["#D6A2E8", "#78E08F", "#F8C291", "#F5CD79", "#E77F67", "#6A89CC"];
      return colors[item.id % colors.length]; // Assign color based on book ID
    };

    return { store, getBookColor };
  },
};
</script>

<style>
.bookshelf {
  /* overflow-x: auto; Horizontal scroll if too many books */
white-space: wrap !important;
}

.book-spine {
  width: 40px; /* Adjust width to make it look like a book spine */
  /* height: 200px;  */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  writing-mode: vertical-rl; /* Rotate text for book spine effect */
  text-orientation: upright;
  border-radius: 4px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Book shadow */
  background: black;
}
</style>
