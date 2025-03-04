<template>
  <div class="p-4">
    <div class="mt-2 space-y-2">
      <input v-model="query" type="text" placeholder="Book title" class="w-full border border-gray-300 rounded px-3 py-2" />
      <input v-model="authorQuery" type="text" placeholder="Author name" class="w-full border border-gray-300 rounded px-3 py-2" />
      <button @click="fetchData" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Search
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const query = ref("");
const authorQuery = ref("");
const emit = defineEmits(["search"]);

const fetchData = () => {
  emit("search", { query: query.value, authorQuery: authorQuery.value });
};
</script>
