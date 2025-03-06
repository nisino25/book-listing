<!-- src/components/SearchTab.vue -->
<template>
  <div class="p-4" v-if="currentMode == 'search'">
    <h2 class="text-xl font-semibold">Search books</h2>
    <div class="mt-2">
      <input
        type="text"
        v-model="store.query"
        placeholder="book title"
        class="block w-full border rounded p-2 mb-2"
      />
      <input
        type="text"
        v-model="store.authorQuery"
        placeholder="author title"
        class="block w-full border rounded p-2 mb-2"
      />
      <input
        type="number"
        v-model="store.isbnQuery"
        placeholder="ISBN"
        class="block w-full border rounded p-2 mb-2"
      />
      <button
        @click="store.fetchData()"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  </div>
</template>

<script>
import { useBookStore } from '@/stores/bookStore';
import { computed } from 'vue';

export default {
  setup() {
    const store = useBookStore();
    return { 
      store,
      currentMode: computed(() => store.currentMode)
    };
  },
};
</script>
