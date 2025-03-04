<template>
  <div class="p-4">
    <div v-if="displayingData.length > 0" class="grid grid-cols-3 gap-4 mt-4">
      <template v-for="(item, index) in displayingData" :key="index">
        <div class="bg-white shadow rounded p-4">
          <img :src="item?.volumeInfo?.imageLinks?.smallThumbnail || '/img/notFound.jpg'" class="w-full h-auto mb-2" />
          <strong class="font-semibold block">No. {{ index + 1 }}: {{ item?.volumeInfo?.title }}</strong>
          <small class="text-gray-500 block">{{ item.volumeInfo?.publishedDate }}</small>
          <button @click="toggleBookInList(item)" class="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
            {{ isInList(item) ? "Remove" : "Add" }}
          </button>
        </div>
      </template>
    </div>
    <div v-if="loading" class="mt-4 text-gray-700">見つかりませんでした。</div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useBookStore } from "@/stores/bookStore";

const bookStore = useBookStore();

defineProps({
  displayingData: Array,
  loading: Boolean,
});

const toggleBookInList = (book) => {
  bookStore.toggleBookInList(book);
};

const isInList = (book) => {
  return bookStore.isInList(book);
};
</script>
