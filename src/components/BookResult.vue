<!-- src/components/BookResult.vue -->
<template>
  <template v-if="store.currentMode !== 'bookShelf'">
    <div class="p-4">
      <!-- Books Display -->
      <div 
        v-if="store.displayingData?.length > 0 && !store.isLoading  && store.displayingData[0]?.id" 
        :class="[
            'grid', 
            'gap-2', 
            store.displayingData.length < 5 ? 'grid-cols-2' : 'grid-cols-3'
        ]"
        >
        <template v-for="item in store.displayingData" :key="item?.id">
          <div class="p-1 relative pb-[40px]">
            <img
              :src="getThumbnail(item)"
              alt="Thumbnail"
              class="block mx-auto mb-4 max-w-full shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            />
            <strong class="block mb-2 leading-tight">
              {{ store.currentMode === 'search' ? item?.volumeInfo?.title : item?.title }}
            </strong>

            <small class="block mb-2 text-gray-700">
              {{ store.currentMode === 'search' ? item.volumeInfo?.authors?.join(", ") ?? "Unknown" :  item.author }}
            </small>
            <small class="block text-gray-700 text-right">
              {{ store.currentMode === 'search' ? getPublishedDate(item) :  formatToJapaneseDate(item?.releaseDte) }}
            </small>
            <button
              @click="handleBookAction(item)"
              class="p-1 px-2 rounded block mx-auto absolute bottom-0 right-0"
            >
              <i class=" fa-bookmark" :class="store.isInList(item) ? 'fa-solid' : 'fa-regular'" style="stroke-width: 1.5;"></i>
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
      <div v-else-if="store.currentMode === 'search' && store.hasSearched && !store.isLoading" class="text-center text-lg font-medium my-4">
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
//     const getThumbnail = (item) => {
//   const originalUrl = store.currentMode === 'search'
//     ? item?.volumeInfo?.imageLinks?.smallThumbnail || '/img/notFound.jpg'
//     : item?.thumbnail || '/img/notFound.jpg';

//   // If it's the placeholder image, return it directly
//   if (originalUrl === '/img/notFound.jpg') {
//     return originalUrl;
//   }

//   // Use CORS proxy only for external images
//   return `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
// };



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
      if (store.currentMode === 'search' && !store.isInList(item)) {
        store.addBookToSpreadsheet(item);
      } else {
        store.deleteRow(item);
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
