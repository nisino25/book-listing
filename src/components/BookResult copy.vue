<!-- src/components/BookResult.vue -->
<template>
  <div class="p-4">
    <!-- Search Results -->
    <div
      v-if="store.displayingData?.length > 0 && store.currentMode === 'search'"
      class="grid grid-cols-3 gap-6"
    >
      <template v-for="(item, index) in store.displayingData" :key="item.id">
        <div class="p-4 border rounded shadow-sm">
          <img
            :src="item?.volumeInfo?.imageLinks?.smallThumbnail || '/img/notFound.jpg'"
            alt="Thumbnail"
            class="block mx-auto mb-4 max-w-full"
          />
          <strong class="block mb-2">
            <mark>No.{{ index + 1 }}:</mark> {{ item?.volumeInfo?.title }}
          </strong>
          <small class="block mb-2 text-gray-700">
            {{ item.volumeInfo?.publishedDate }}
          </small>
          <button
            @click="store.addBookToSpreadsheet(item)"
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {{ store.isInList(item) ? "Remove" : "Add" }}
          </button>
        </div>
      </template>
      <button
        @click="store.getMore()"
        v-if="store.incomingTotal > store.displayingData.length"
        class="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Get more ({{ store.incomingTotal }} / {{ store.displayingData.length }})
      </button>
    </div>
    <!-- No Results Message -->
    <div
      v-else-if="store.currentMode === 'search' && store.hasSearched"
      class="text-center text-lg font-medium my-4"
    >
      <h5>見つかりませんでした。</h5>
    </div>

    <!-- My List -->
    <div v-if="store.currentMode === 'myList'" class="grid grid-cols-3 gap-2">
      <template v-for="(item, index) in store.displayingData" :key="item.id">
        <div class="p-4 border rounded shadow-sm">
          <img
            :src="item?.thumbnail || '/img/notFound.jpg'"
            alt="Thumbnail"
            class="block mx-auto mb-4 max-w-full"
          />
          <strong class="block mb-2">
            <mark>No.{{ index + 1 }}:</mark> {{ item?.title }}
          </strong>
          <small class="block mb-2 text-gray-700">{{ item?.publishedDate }}</small>
          <button
            @click="store.toggleBookInList(item)"
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {{ store.isInList(item) ? "Remove" : "Add" }}
          </button>
        </div>
      </template>
    </div>

    <!-- LOADING ANIMATION -->
    <div v-if="store.displayingData?.length == 0 && store.isLoading" class="text-center fixed left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2">
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
    
    return { store };
  },
};
</script>

<style>
@keyframes ripple {
    from {
        transform: translate(-50%,-50%) scale(0);
        opacity: 1;
    }
    to {
        transform: translate(-50%,-50%) scale(1.5);
        opacity: 0;
    }
}
</style>
