<template>
  <div class="p-4" v-if="currentMode == 'search'">
    <h2 class="text-xl font-semibold">Search books</h2>
    <div class="mt-2">
      <input
        type="text"
        v-model="store.query"
        placeholder="Book title"
        class="block w-full border rounded p-2 mb-2"
      />
      <input
        type="text"
        v-model="store.authorQuery"
        placeholder="Author name"
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
      <button
        @click="scanBarcode"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
      >
        {{ isScanning ? "Scanning..." : "Scan Barcode" }}
      </button>
    </div>
    
    <div class="mt-4" v-if="isScanning">
      <video ref="videoElement" class="w-full border rounded"></video>
      <p class="mt-2 text-sm text-gray-500">Scanning... Hold barcode steady in front of the camera.</p>
      <p v-if="detectedCode" class="mt-2 text-lg font-semibold text-green-600">Detected: {{ detectedCode }}</p>
    </div>
  </div>
</template>

<script>
import { useBookStore } from '@/stores/bookStore';
import { computed, ref, onUnmounted, nextTick } from 'vue';
import { BrowserMultiFormatReader } from "@zxing/library";

export default {
  setup() {
    const store = useBookStore();
    const currentMode = computed(() => store.currentMode);
    const isScanning = ref(false);
    const videoElement = ref(null);
    const scanner = ref(null);
    const detectedCode = ref("");

    const scanBarcode = async () => {
      isScanning.value = true;
      
      // Wait for the DOM to update with the video element
      await nextTick();
      
      scanner.value = new BrowserMultiFormatReader();

      try {
        await scanner.value.decodeFromVideoDevice(
          null,
          videoElement.value,
          (result) => {
            if (result) {
              detectedCode.value = result.text;
              store.isbnQuery = result.text;
              stopScanning();
              store.fetchData();
            }
          }
        );
      } catch (error) {
        console.error("Barcode scanning failed:", error);
        isScanning.value = false;
      }
    };

    const stopScanning = () => {
      if (scanner.value) {
        scanner.value.reset();
      }
      isScanning.value = false;
    };

    onUnmounted(() => {
      stopScanning();
    });

    return { store, currentMode, isScanning, scanBarcode, videoElement, detectedCode };
  },
};
</script>
