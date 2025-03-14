<!-- App.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main Content Area -->
    <div class="flex-1 pt-4 absolute h-[calc(100dvh-102px)] overflow-scroll w-full">
      <SearchTab />
      <BookResult />
      <BookShelf />
    </div>
    <!-- Bottom Menu always visible -->
    <MenuTab />
  </div>
</template>

<script>
import SearchTab from '@/components/SearchTab.vue';
import BookResult from '@/components/BookResult.vue';
import BookShelf from '@/components/BookShelf.vue';
import MenuTab from '@/components/MenuTab.vue';

import { useBookStore } from '@/stores/bookStore';

export default {
  name: 'App',
  components: {
    SearchTab,
    BookResult,
    BookShelf,
    MenuTab,
  },
  setup(){
    const store = useBookStore();
    return { store };
  }
};
</script>

<style>
  html{
    font-family: "Merriweather Sans", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
  }

  body{
    background-color: #FFEFD7;
  }
</style>
