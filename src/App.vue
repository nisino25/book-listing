<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <!-- Top Bar: Search vs My List -->
    <div class="flex gap-6 mb-4">
      <!-- Search -->
      <div @click="currentMode = 'search'; displayingData = []" class="cursor-pointer">
        <h2 class="text-xl font-semibold">Search books</h2>
        <div v-if="currentMode === 'search'" class="mt-2">
          <input
            type="text"
            v-model="query"
            placeholder="book title"
            class="block w-full border rounded p-2 mb-2"
          />
          <input
            type="text"
            v-model="authorQuery"
            placeholder="author title"
            class="block w-full border rounded p-2 mb-2"
          />
          <button
            @click="fetchData"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      <!-- My List -->
      <div @click="currentMode = 'myList'; displayingData = myBookList" class="cursor-pointer">
        <h2 class="text-xl font-semibold">My List</h2>
      </div>
    </div>

    <hr class="my-6" />

    <!-- Search Results Grid -->
    <div
      v-if="displayingData?.length > 0 && currentMode === 'search'"
      class="grid grid-cols-3 gap-6"
    >
      <template v-for="(item, index) in displayingData" :key="index">
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
            @click="addBookToSpreadsheet(item)"
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {{ isInList(item) ? "Remove" : "Add" }}
          </button>
        </div>
      </template>
      <button
        @click="getMore"
        v-if="incomingTotal > displayingData.length && currentMode === 'search'"
        class="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Get more ({{ incomingTotal }} / {{ displayingData.length }})
      </button>
    </div>

    <!-- If no search results -->
    <div
      v-if="!displayingData && currentMode === 'search'"
      class="text-center text-lg font-medium my-4"
    >
      <h5>見つかりませんでした。</h5>
    </div>

    <!-- My List Grid -->
    <div
      v-if="displayingData?.length > 0 && currentMode === 'myList'"
      class="grid grid-cols-3 gap-2"
    >
      <template v-for="(item, index) in displayingData" :key="index">
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
            @click="toggleBookInList(item)"
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {{ isInList(item) ? "Remove" : "Add" }}
          </button>
        </div>
      </template>
      <!-- Note: This 'Get more' button is currently conditioned on search mode,
           but included here for demonstration. Adjust logic as needed. -->
      <button
        @click="getMore"
        v-if="incomingTotal > displayingData?.length && currentMode === 'search'"
        class="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Get more ({{ incomingTotal }} / {{ displayingData?.length }})
      </button>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const fetchedBookData = ref([]);
        const incomingTotal = ref(null);
        const maxResults = ref(40);
        const query = ref('百田尚樹');
        const authorQuery = ref('');
        const myBookList = ref([]);
        const displayingData = ref([]);
        const currentMode = ref('search');
        const baseUrl =
            'https://script.google.com/macros/s/AKfycbymXhvSkr7uPI_9SuY6FbZsWBn_U6mJ1s05DNG4WOlw_vaPAnsGi9Oqc5WtPbpNaPE/exec';
        // const fetchedMyList = ref([]);

        const fetchApi = () => {
            console.log(`getting reload`);
            const url = `${baseUrl}?callback=jsonpCallback&action=fetchData`;
            console.log(url);

            // Define the callback function globally
            window.jsonpCallback = (data) => {
                console.log("API Response (fetchData):", data);
                if (data.success) {
                    myBookList.value = data.data;
                    console.log(myBookList.value);
                } else {
                    console.error("Error fetching data:", data.message);
                }
            };

            // Dynamically add a <script> tag to call the JSONP API
            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            document.body.appendChild(script);

            // Clean up the <script> tag after the request
            script.onload = () => {
                document.body.removeChild(script);
            };
        };

        const fetchData = async () => {
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                query.value
            )}+inauthor:${authorQuery.value}&maxResults=${maxResults.value}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }

                const json = await response.json();
                console.log(json);
                displayingData.value = json.items;
                incomingTotal.value = json.totalItems;
            } catch (error) {
                console.error(error.message);
            }
        };

        const getMore = async () => {
            console.log('gettin more');
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                query.value
            )}&maxResults=${maxResults.value}&startIndex=${fetchedBookData.value.length}`;

            console.log(url);

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }

                const json = await response.json();
                console.log(json);
                displayingData.value = displayingData.value.concat(json.items);
            } catch (error) {
                console.error(error.message);
            }
        };

        const toggleBookInList = (book) => {
            const index = myBookList.value.findIndex((item) => item.id === book.id);
            if (index !== -1) {
                myBookList.value.splice(index, 1);
                alert("Book removed from your list.");
            } else {
                console.log(book.volumeInfo.imageLinks);

                let addingData = {
                    id: book.id,
                    title: book.volumeInfo.title,
                    publishedDate: book.volumeInfo?.publishedDate,
                    pageCount: book.volumeInfo?.pageCount,
                    subtitle: book.volumeInfo?.pageCount.subtitle ?? false,
                    authors: book.volumeInfo?.authors?.join(", ") ?? "Unknown",
                };

                if (
                    book.volumeInfo?.imageLinks?.smallThumbnail ===
                    `http://books.google.com/books/content?id=${addingData.id}&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api`
                ) {
                    addingData.thumbnail = book.volumeInfo?.imageLinks?.smallThumbnail;
                }

                myBookList.value.push(addingData);
                alert("Book added to your list!");
            }
            localStorage.setItem("myBookList", JSON.stringify(myBookList.value));
        };

        const isInList = (book) => {
            return myBookList.value.some((item) => item.id === book.id);
        };

        const addBookToSpreadsheet = async (book) => {
            const index = myBookList.value.findIndex((item) => item.id === book.id);
            if (index !== -1) {
                myBookList.value.splice(index, 1);
                alert("Book removed from your list.");
            } else {
                const params = new URLSearchParams({
                    action: "addRow",
                    id: book.id,
                    title: book.volumeInfo.title,
                    author: book.volumeInfo?.authors?.join(", ") ?? "Unknown",
                    startingDate: new Date().toISOString().split("T")[0],
                    finishingDate: "",
                    releaseDate: book.volumeInfo?.publishedDate ?? "",
                    thumbnail: book.volumeInfo?.imageLinks?.smallThumbnail ?? "",
                    genre: book.volumeInfo?.categories?.join(", ") ?? "Unknown",
                    subtitle: book.volumeInfo?.subtitle ?? "",
                    status: "Not Started",
                    timestamp: new Date().getTime(),
                });

                try {
                    const URL = `${baseUrl}?${params.toString()}&callback=jsonpCallback`;
                    console.log("Fetching:", URL);

                    const response = await fetch(URL);
                    const json = await response.json();
                    console.log("Response:", json);

                    if (json.success) {
                        alert("Book added to your spreadsheet!");
                        console.log("Added:", json);
                    } else {
                        throw new Error(json.message);
                    }
                } catch (error) {
                    console.error("Error adding book:", error.message);
                }
            }
        };

        onMounted(() => {
            console.clear();
            fetchApi();
        });

        return {
            fetchedBookData,
            incomingTotal,
            maxResults,
            query,
            authorQuery,
            myBookList,
            displayingData,
            currentMode,
            fetchApi,
            fetchData,
            getMore,
            toggleBookInList,
            isInList,
            addBookToSpreadsheet,
        };
    },
};
</script>