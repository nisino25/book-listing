<template>
  <div>
    <h1>Book Search</h1>
    <input v-model="query" @keyup.enter="searchBooks" placeholder="Search for books...">
    <button @click="searchBooks">Search</button>
    <div v-if="loading">Loading...</div>
    <ul v-if="books.length > 0">
      <li v-for="book in books" :key="book.id" class="book-item">
        <img :src="book.volumeInfo.imageLinks?.thumbnail" alt="Book Thumbnail">
        <h2>{{ book.volumeInfo.title }}</h2>
        <p>{{ book.volumeInfo.authors?.join(', ') }}</p>
        <p>{{ book.volumeInfo.publisher }} - {{ book.volumeInfo.publishedDate }}</p>
        <p>{{ book.volumeInfo.description }}</p>
        <a :href="book.volumeInfo.previewLink" target="_blank">Preview</a>
        <a v-if="book.saleInfo.saleability === 'FOR_SALE'" :href="'https://www.amazon.co.jp/dp/' + book.volumeInfo.industryIdentifiers[0].identifier" target="_blank">Buy on Amazon</a>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      query: '',
      books: [],
      loading: false,
    };
  },
  methods: {
    async searchBooks() {
      if (this.query.trim() === '') return;
      this.loading = true;
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(this.query)}`
        );
        this.books = response.data.items || [];
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
input {
  margin-right: 10px;
  padding: 5px;
}
button {
  padding: 5px 10px;
}
ul {
  list-style: none;
  padding: 0;
}
li.book-item {
  margin: 20px 0;
  display: flex;
  align-items: center;
}
img {
  margin-right: 20px;
  width: 100px;
}
</style>
