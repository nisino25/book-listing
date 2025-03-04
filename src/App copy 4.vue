<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <div class="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
      <h1 class="text-2xl font-bold mb-4">Book Scanner</h1>

      <!-- Manual ISBN Input -->
      <input
        v-model="manualISBN"
        type="text"
        placeholder="Enter ISBN"
        class="border border-gray-300 rounded px-4 py-2 w-full mb-4"
      />
      <button
        @click="fetchBookData(manualISBN)"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
      >
        Search ISBN
      </button>

      <!-- Barcode Scanner -->
      <button
        @click="scanBarcode"
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        {{ isScanning ? "Scanning..." : "Scan Barcode" }}
      </button>

      <video v-if="isScanning" ref="videoElement" class="mt-4 w-full"></video>

      <!-- Book Information Display -->
      <div v-if="bookTitle" class="mt-6 text-left">
        <h2 class="text-xl font-semibold">{{ bookTitle }}</h2>
        <p class="text-gray-600">by {{ bookAuthor || "Unknown" }}</p>
        <img v-if="bookCover" :src="bookCover" alt="Book Cover" class="mt-4 rounded-lg shadow w-full">
        <p v-if="bookDescription" class="mt-4 text-gray-700 text-sm">{{ bookDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { BrowserMultiFormatReader } from "@zxing/library";

const scanner = ref(null);
const bookTitle = ref("");
const bookAuthor = ref("");
const bookCover = ref("");
const bookDescription = ref("");
const isScanning = ref(false);
const videoElement = ref(null);
const manualISBN = ref("");

// Google Books API Key (Replace with your own key if needed)
// const API_KEY = "YOUR_API_KEY"; // Optional (API works without a key but with limits)

const scanBarcode = async () => {
  isScanning.value = true;
  scanner.value = new BrowserMultiFormatReader();

  try {
    await scanner.value.decodeFromVideoDevice(
      null,
      videoElement.value,
      (result) => {
        if (result) {
          fetchBookData(result.text);
          stopScanning();
        }
      }
    );
  } catch (error) {
    console.error("Barcode scanning failed:", error);
    isScanning.value = false;
  }
};

const fetchBookData = async (isbn) => {
  if (!isbn) {
    alert("Please enter a valid ISBN.");
    return;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
    console.log(isbn);
    console.log(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    const data = await response.json();

    if (data.totalItems > 0) {
      const book = data.items[0].volumeInfo;

      bookTitle.value = book.title || "Unknown Title";
      bookAuthor.value = book.authors ? book.authors.join(", ") : "Unknown Author";
      bookCover.value = book.imageLinks ? book.imageLinks.thumbnail : "";
      bookDescription.value = book.description || "No description available.";
    } else {
      alert("Book not found!");
    }
  } catch (error) {
    console.error("Error fetching book data:", error);
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
</script>

<style>
/* Tailwind CSS is already applied via CDN */
</style>
