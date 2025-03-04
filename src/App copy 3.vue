<template>
  <div class="menu-tab" style="display: flex; gap:1em">
    <div @click="currentMode = 'search';displayingData = []">
      <h2>Search books</h2>
      <div v-if="currentMode == 'search'">
        <input 
          type="text" 
          v-model="query"
          placeholder="book title"
        >
        <br>
        <input 
          type="text" 
          v-model="authorQuery" 
          placeholder="author title"
        >
        <br>
        <button @click="fetchData">search</button>
      </div>
    </div>
    <div @click="currentMode = 'myList'; displayingData = myBookList">
      <h2>my list</h2>
    </div>
    
  </div>
  <hr>
  <div v-if="displayingData?.length > 0 && currentMode == 'search'" class="book-container">
    <tempalte v-for="(item,index) in displayingData" :key="index">

      <div class="book-block">
        <img :src="item?.volumeInfo?.imageLinks?.smallThumbnail || '/img/notFound.jpg'" alt="Thumbnail">
        <strong><mark>No.{{ index+1}}: </mark>{{ item?.volumeInfo?.title }}</strong><br>
        <small>{{ item.volumeInfo?.publishedDate }}</small>
        <button @click="addBookToSpreadsheet(item)">
          {{ isInList(item) ? "Remove" : "Add" }}
        </button>
      </div>
      <hr>
    </tempalte>
    <button @click="getMore()" v-if="incomingTotal > displayingData.length && currentMode =='search'">Get more({{ incomingTotal }} / {{ displayingData.length }})</button>
  </div>
  <div v-if="!displayingData && currentMode == 'search'">
    <H5>見つかりませんでした。</H5>
  </div>
  <div v-if="displayingData?.length > 0 && currentMode == 'myList'" class="book-container">
    <tempalte v-for="(item,index) in displayingData" :key="index">

      <div class="book-block">
        <img :src="item?.thumbnail || '/img/notFound.jpg'" alt="Thumbnail">
        <strong><mark>No.{{ index+1}}: </mark>{{ item?.title }}</strong><br>
        <small>{{ item?.publishedDate }}</small>
        <button @click="toggleBookInList(item)">
          {{ isInList(item) ? "Remove" : "Add" }}
        </button>
      </div>
    </tempalte>
    <button @click="getMore()" v-if="incomingTotal > displayingData?.length && currentMode =='search'">Get more({{ incomingTotal }} / {{ displayingData?.length }})</button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      fetchedBookData: [],
      incomingTotal: null,
      maxResults: 40,
      query: '百田尚樹',
      authorQuery: '',
      myBookList: [],
      displayingData: [],
      currentMode: 'search',

      baseUrl : 'https://script.google.com/macros/s/AKfycbymXhvSkr7uPI_9SuY6FbZsWBn_U6mJ1s05DNG4WOlw_vaPAnsGi9Oqc5WtPbpNaPE/exec',

      fetchedMyList: [],

    };
  },
  methods: {
    fetchApi() {
        console.log(`getting reload`);

        const url = `${this.baseUrl}?callback=jsonpCallback&action=fetchData`;
        console.log(url);

        // Define the callback function globally
        window.jsonpCallback = (data) => {
            console.log("API Response (fetchData):", data);
            if (data.success) {
                this.myBookList = data.data;
                console.log(this.myBookList)
            } else {
                console.error("Error fetching data:", data.message);
            }
        };

        // Dynamically add a <script> tag to call the JSONP API
        const script = document.createElement("script");
        script.src = url; // Set the API URL
        script.async = true; // Load asynchronously
        document.body.appendChild(script);

        // Clean up the <script> tag after the request
        script.onload = () => {
            document.body.removeChild(script); // Remove the script tag
        };
    },
    async fetchData(){
      // const query = 'アイシールド２１'

      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(this.query)}+inauthor:${this.authorQuery}&maxResults=${this.maxResults}`

      try{
        const response = await fetch(url);
        if(!response.ok){
          throw new Error(`Status: ${response.stauts}`)
        }

        
        const json = await response.json();
        console.log(json);
        this.displayingData = json.items
        this.incomingTotal = json.totalItems
      } catch(error){
        console.error(error.message)
      }
    },  
    
    async getMore(){
      console.log('gettin more');
      // const query = 'アイシールド２１'

      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(this.query)}&maxResults=${this.maxResults}&startIndex=${this.fetchedBookData.length}`

      console.log(url)

      try{
        const response = await fetch(url);
        if(!response.ok){
          throw new Error(`Status: ${response.stauts}`)
        }

        
        const json = await response.json();
        console.log(json);
        this.displayingData = this.displayingData.concat(json.items);
      } catch(error){
        console.error(error.message)
      }
    },

    toggleBookInList(book) {
      // Check if the book already exists in the list
      const index = this.myBookList.findIndex((item) => item.id === book.id);
      if (index !== -1) {
        // If the book exists, remove it
        this.myBookList.splice(index, 1);
        alert("Book removed from your list.");
      } else {
        console.log(book.volumeInfo.imageLinks)

        let addingData = {
          id: book.id,
          title: book.volumeInfo.title,
          publishedDate: book.volumeInfo?.publishedDate,
          pageCount: book.volumeInfo?.pageCount,
          subtitle: book.volumeInfo?.pageCount.subtitle ?? false,
          authors: book.volumeInfo?.authors?.join(", ") ?? "Unknown",
        }

        if(book.volumeInfo?.imageLinks?.smallThumbnail == `http://books.google.com/books/content?id=${addingData.id}&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api`){
          addingData.thumbnail = book.volumeInfo?.imageLinks?.smallThumbnail
        }

        // If the book does not exist, add it
        this.myBookList.push(addingData);
        alert("Book added to your list!");
      }

      // Save updated list to local storage
      localStorage.setItem("myBookList", JSON.stringify(this.myBookList));
    },
    isInList(book) {
      // Utility method to check if the book is in the list
      return this.myBookList.some((item) => item.id === book.id);
    },

    async addBookToSpreadsheet(book) {
      const index = this.myBookList.findIndex((item) => item.id === book.id);
      if (index !== -1) {
        // If the book exists, remove it
        this.myBookList.splice(index, 1);
        alert("Book removed from your list.");
      } else {
        const params = new URLSearchParams({
          action: "addRow",
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo?.authors?.join(", ") ?? "Unknown",
          startingDate: new Date().toISOString().split("T")[0], // Current date as start date
          finishingDate: "",
          releaseDate: book.volumeInfo?.publishedDate ?? "",
          thumbnail: book.volumeInfo?.imageLinks?.smallThumbnail ?? "",
          genre: book.volumeInfo?.categories?.join(", ") ?? "Unknown",
          subtitle: book.volumeInfo?.subtitle ?? "",
          status: "Not Started", // Default status
          timestamp: new Date().getTime(), // Cache buster

        });

        try {
          const URL = `${this.baseUrl}?${params.toString()}&callback=jsonpCallback`;
          console.log("Fetching:", URL); // Debugging log

          const response = await fetch(URL);
          const json = await response.json();
          console.log("Response:", json); // Debugging response

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
    },

  },
  mounted(){
    console.clear();


    this.fetchApi();

  },
};
</script>

<style scoped>
.book-container{
  display: grid;
  grid-template-columns: repeat(8,1fr);
  gap: 2.5%;
  justify-content: space-between;
}
img{
  display: block;
  margin: auto;
  margin-bottom: 1em;
  max-width: 100%;
}
</style>