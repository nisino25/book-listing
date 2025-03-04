<template>
  <div class="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-300 p-2 flex justify-around">
    <button @click="setMode('search')" class="flex flex-col items-center">
      <i class="fas fa-search text-xl"></i>
      <span>Search</span>
    </button>

    <button @click="setMode('myList')" class="flex flex-col items-center">
      <i class="fas fa-list text-xl"></i>
      <span>My List</span>
    </button>
  </div>
</template>

<script setup>
import { useBookStore } from '@/stores/bookStore';

const bookStore = useBookStore();
const setMode = (mode) => {
  bookStore.setCurrentMode(mode);
};
</script>

<style scoped>
button {
  padding: 8px;
  font-size: 14px;
}
</style>
