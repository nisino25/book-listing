// src/stores/bookStore.js
import { defineStore } from 'pinia';

// We define our store with a unique name ("bookStore")
// All of your state and actions from the component go here.
export const useBookStore = defineStore('bookStore', {
    state: () => ({
        fetchedBookData: [],
        incomingTotal: null,
        maxResults: 40,
        query: '',
        // authorQuery: '村上春樹',
        authorQuery: '',
        // isbnQuery: '9784120049781',
        isbnQuery: '',
        myBookList: [],
        displayingData: [],
        currentMode: 'search',
        baseUrl:
            'https://script.google.com/macros/s/AKfycbwWv7_QS4f3Nd7DAyMtLEdCahNuHowCkv57zDyr19v3nwOAU6FQACd61e3VjFAw8ml1/exec',

        isLoading: false,
        hasSearched: false,
    }),
    actions: {
        // Load your Google Sheets data
        fetchApi() {
            this.displayingData = [];
            this.myBookList = [];
            this.isLoading = true;
            console.log(`getting reload`);
            const url = `${this.baseUrl}?callback=jsonpCallback&action=fetchData`;
            console.log(url);

            // Define the callback function globally
            window.jsonpCallback = (data) => {
                if (data.success) {
                    this.displayingData = data.data;
                    this.isLoading = false;
                    this.myBookList = this.displayingData;
                    console.log(this.myBookList);
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
        },

        // Search from Google Books API
        async fetchData() {
            
            this.displayingData = [];
            this.isLoading = true;

            if(this.isbnQuery){
                const url = `https://api.openbd.jp/v1/get?isbn=${this.isbnQuery}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Status: ${response.status}`);
                    }
                    const json = await response.json();

                    // Check if data is valid
                    if (!json || !json[0]) {
                        throw new Error("No book data found");
                    }

                    console.log(json);

                    // Transform API response into desired format
                    const transformedData = json.map(book => ({
                        id: book.summary.isbn,
                        volumeInfo: {
                            title: book.summary.title,
                            authors: [book.summary.author.replace(/,/g, ', ')], // Format authors
                            startingDate: "",
                            finishingDate: "",
                            publishedDate: book.hanmoto?.dateshuppan || "", // Handle optional data
                            thumbnail: book.summary.cover || "", // Use cover if available
                            genre: book.summary.series || "",
                            subtitle: "",
                            status: "",
                            timestamp: new Date().toISOString()
                        }
                    }));

                    // Assign transformed data to displayingData
                    this.displayingData = transformedData;

                    if(this.displayingData.length > 0){
                        this.query = this.displayingData[0]?.volumeInfo?.title;
                    }else{
                        this.isLoading = false;
                        this.hasSearched = true;
                    }

                } catch (error) {
                    this.isLoading = false;
                    this.hasSearched = true;
                    this.displayingData = []
                    console.error(error.message);
                }
            }
            
            if(!this.query) return;

            let url = `https://www.googleapis.com/books/v1/volumes?q=${this.query}+inauthor:${this.authorQuery}&maxResults=${this.maxResults}&orderBy=relevance`;
            
            if(this.query.length > 0 && this.authorQuery.length == 0){
                url = `https://www.googleapis.com/books/v1/volumes?q=${this.query}&maxResults=${this.maxResults}&orderBy=relevance`;
            }

            try {
                console.log('--------- tryna combine');
                console.log(url);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }
                const json = await response.json();
                this.incomingTotal = json.totalItems;
                this.isLoading = false;
                this.hasSearched = true;
                // this.displayingData = json.items;
                this.displayingData = this.displayingData.concat(json.items);

                console.log(this.displayingData)
            } catch (error) {
                console.error(error.message);
            }
        },

        async getMore() {
            console.log('gettin more');
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                this.query
            )}&maxResults=${this.maxResults}&startIndex=${this.fetchedBookData.length}`;

            console.log(url);

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }
                const json = await response.json();
                // Append new results to existing
                this.displayingData = this.displayingData.concat(json.items);
            } catch (error) {
                console.error(error.message);
            }
        },

        toggleBookInList(book) {
            const index = this.myBookList.findIndex((item) => item.id === book.id);
            if (index !== -1) {
                this.myBookList.splice(index, 1);
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

                this.myBookList.push(addingData);
                alert("Book added to your list!");
            }
            localStorage.setItem("myBookList", JSON.stringify(this.myBookList));
        },

        isInList(book) {
            return this.myBookList.some((item) => item.id === book.id);
        },

        async addBookToSpreadsheet(book) {

            this.myBookList.push(book);
            alert("Book added to your list!");
            
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
                const URL = `${this.baseUrl}?${params.toString()}&callback=jsonpCallback`;
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
            
        },

        async deleteRow(book) {

            const index = this.myBookList.findIndex((item) => item.id === book.id);

            const confirmDelete = confirm(`Are you sure you want to remove "${book.title}" from your list?`);
            if (!confirmDelete) return;
            
            this.myBookList.splice(index, 1);
            alert("Book removed from your list.");
            
            const params = new URLSearchParams({
                action: "deleteRow",
                bookId: book.id,
            });

            try {
                const URL = `${this.baseUrl}?${params.toString()}&callback=jsonpCallback`;
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
            
        },


    },
});
