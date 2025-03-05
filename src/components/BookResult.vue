<!-- src/components/BookResult.vue -->
<template>
  <div class="p-4">
    <!-- Books Display -->
    <div v-if="store.displayingData?.length > 0" class="grid grid-cols-3 gap-3">
      <template v-for="item in store.displayingData" :key="item.id">
        <div class="p-2 border rounded shadow-sm">
          <img
            :src="getThumbnail(item)"
            alt="Thumbnail"
            class="block mx-auto mb-4 max-w-full"
          />
          <strong class="block mb-2">
            {{ store.currentMode === 'search' ? item?.volumeInfo?.title : item?.title }}
          </strong>
          <small class="block mb-2 text-gray-700">
            {{ getPublishedDate(item) }}
            {{ store.currentMode === 'search' ? getPublishedDate(item) :  formatToJapaneseDate(item?.releaseDte) }}
          </small>
          <button
            @click="handleBookAction(item)"
            class="p-1 px-2 rounded text-white text-center text-sm block mx-auto"
            :class="store.isInList(item) ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'"
          >
            <i :class="store.isInList(item) ? 'fa-solid fa-trash' : 'fa-solid fa-plus'"></i>
          </button>

        </div>
      </template>

      <!-- Load More Button -->
      <button
        @click="store.getMore()"
        v-if="store.currentMode === 'search' && store.incomingTotal > store.displayingData.length"
        class="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Get more ({{ store.incomingTotal }} / {{ store.displayingData.length }})
      </button>
    </div>

    <!-- No Results Message -->
    <div v-else-if="store.currentMode === 'search' && store.hasSearched" class="text-center text-lg font-medium my-4">
      <h5>見つかりませんでした。</h5>
    </div>

    <!-- Loading Animation -->
    <div v-if="store.displayingData?.length == 0 && store.isLoading" class="text-center fixed left-1/2 top-[35%] transform -translate-x-1/2 -translate-y-1/2">

      <!-- <div  class="text-center fixed left-1/2 top-65/100 transform -translate-x-1/2 -translate-y-1/2"></div> -->
      <div class="relative w-[22.5vw] aspect-square m-8">
          <div class="absolute w-[80%] h-[80%] border-4 border-indigo-300 rounded-full animate-[ripple_1.5s_infinite] left-1/2 top-1/2 text-center fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute w-[80%] h-[80%] border-4 border-indigo-300 rounded-full animate-[ripple_1.5s_infinite] [animation-delay:0.5s] left-1/2 top-1/2 text-center fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useBookStore } from '@/stores/bookStore';

export default {
  name: 'BookResult',
  setup() {
    const store = useBookStore();

    const getThumbnail = (item) =>
      store.currentMode === 'search'
        ? item?.volumeInfo?.imageLinks?.smallThumbnail || '/img/notFound.jpg'
        : item?.thumbnail || '/img/notFound.jpg';

    const getTitle = (item) =>
      store.currentMode === 'search' ? item?.volumeInfo?.title : item?.title;

    const getPublishedDate = (item) =>
      store.currentMode === 'search' ? item?.volumeInfo?.publishedDate : item?.publishedDate;

    const formatToJapaneseDate = (utcString) => {
        if(!utcString) return '';
        const date = new Date(utcString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };


    const handleBookAction = (item) => {
      if (store.currentMode === 'search') {
        store.addBookToSpreadsheet(item);
      } else {
        store.toggleBookInList(item);
      }
    };

    return { store, getThumbnail, getTitle, getPublishedDate, handleBookAction,formatToJapaneseDate };
  },
};
</script>

<style>
@keyframes ripple {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}
</style>
