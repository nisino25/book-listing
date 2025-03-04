import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useBookStore } from "@/stores/bookStore";
// import { BrowserMultiFormatReader } from "@zxing/library";
import MenuTab from "@/components/MenuTab.vue";
import SearchResults from "@/components/SearchResults.vue";
import SearchInput from "@/components/SearchInput.vue";

export default defineComponent({
  components: {
    MenuTab,
    SearchResults,
    SearchInput,
  },
  setup() {
    const bookStore = useBookStore();
    const query = ref("百田尚樹");
    const authorQuery = ref("");
    const displayingData = ref([]);
    const incomingTotal = ref(null);
    const maxResults = 40;
    const loading = ref(false);
    const myBookList = ref([]);
    
    const scanner = ref(null);
    const bookTitle = ref("");
    const bookAuthor = ref("");
    const bookCover = ref("");
    const bookDescription = ref("");
    const isScanning = ref(false);
    const videoElement = ref(null);
    const manualISBN = ref("");
    // const hasSearched = ref(false);

    const baseUrl = "https://script.google.com/macros/s/AKfycbymXhvSkr7uPI_9SuY6FbZsWBn_U6mJ1s05DNG4WOlw_vaPAnsGi9Oqc5WtPbpNaPE/exec";

    const fetchApi = () => {
      console.log(`getting reload`);
      const url = `${baseUrl}?callback=jsonpCallback&action=fetchData`;
      console.log(url);

      window.jsonpCallback = (data) => {
        console.log("API Response (fetchData):", data);
        if (data.success) {
          myBookList.value = data.data;
        } else {
          console.error("Error fetching data:", data.message);
        }
      };

      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        document.body.removeChild(script);
      };
    };

    const fetchData = async () => {
      console.log("Fetching data...");
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query.value)}+inauthor:${authorQuery.value}&maxResults=${maxResults}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const json = await response.json();
        console.log("Fetched data:", json);
        displayingData.value = json.items;
        incomingTotal.value = json.totalItems;
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
      loading.value = true;
    };

    const getMore = async () => {
      console.log("getting more");
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query.value)}&maxResults=${maxResults}&startIndex=${displayingData.value.length}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const json = await response.json();
        displayingData.value = displayingData.value.concat(json.items);
      } catch (error) {
        console.error(error.message);
      }
    };

    const toggleBookInList = (book) => {
      bookStore.toggleBookInList(book);
    };

    const isInList = (book) => {
      return bookStore.isInList(book);
    };

    onMounted(() => {
      console.clear();
      fetchApi();
    });

    onUnmounted(() => {
      scanner.value?.reset();
    });

    return {
      query,
      authorQuery,
      displayingData,
      incomingTotal,
      loading,
      fetchData,
      getMore,
      toggleBookInList,
      isInList,
      manualISBN,
      bookTitle,
      bookAuthor,
      bookCover,
      bookDescription,
      isScanning,
      videoElement,
      myBookList,
      currentMode: computed(() => bookStore.currentMode),
      setCurrentMode: bookStore.setCurrentMode,
    };
  },
});