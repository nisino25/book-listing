<!-- App.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main Content Area -->
    <div class="flex-1 pt-4 absolute h-[calc(100dvh-100px)] overflow-scroll">
      <SearchTab />
      <BookResult />
    </div>
    <!-- Bottom Menu always visible -->
    <MenuTab />
  </div>
</template>

<script>
import SearchTab from '@/components/SearchTab.vue';
import BookResult from '@/components/BookResult.vue';
import MenuTab from '@/components/MenuTab.vue';

export default {
  name: 'App',
  components: {
    SearchTab,
    BookResult,
    MenuTab,
  },
};
</script>
