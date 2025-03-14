<template>
  <template v-if="store.currentMode == 'bookShelf'">
    <span>{{ displayingData?.length }}</span>
    <div class="p-4">
      <div v-if="store.displayingData?.length > 0 && !store.isLoading" class="flex flex-wrap gap-y-8 justify-center">
        <template v-for="(book,index) in store.displayingData" :key="book.id">
            <div 
                class="h-40 w-12 flex items-center justify-center text-xs font-bold text-center break-words book-container box-shadow" 
                :style="{ backgroundColor: book.bgColor, color : book.textColor }"
                @click="pullOut(index)"
                :class="{ 'pulling-out' : index == pulledOutIndex }"
                >
                <div class="spine">
                    {{ book.title }}
                </div>
                <img class="left-cover" :id="book.id" :src="book.thumbnail ? 'https://images.weserv.nl/?url=' + encodeURIComponent(book.thumbnail.replace(/^https?:\/\//, '')) : '/img/notFound.jpg'" crossOrigin="Anonymous" @load="extractColor(book)" alt="Book Cover">
                <div class="right-cover"></div>
            </div>
        </template>
      </div>
  
      <!-- No Results Message -->
      <div v-else-if="store.currentMode === 'bookShelf' && store.hasSearched && !isLoading" 
        class="text-center text-lg font-medium my-4">
        <h5>見つかりませんでした。</h5>
      </div>
  
      <!-- Loading Animation -->
      <div v-if="store.displayingData?.length == 0 && store.isLoading" 
        class="text-center fixed left-1/2 top-[35%] transform -translate-x-1/2 -translate-y-1/2">
        <div class="relative w-[22.5vw] aspect-square m-8">
            <div class="absolute w-[80%] h-[80%] border-4 border-indigo-300 rounded-full animate-[ripple_1.5s_infinite] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute w-[80%] h-[80%] border-4 border-indigo-300 rounded-full animate-[ripple_1.5s_infinite] [animation-delay:0.5s] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  </template>

</template>

<script>
import { useBookStore } from '@/stores/bookStore';
import { ref } from 'vue';
import tinycolor from 'tinycolor2';


export default {
  name: 'BookResult',
  setup() {
      const store = useBookStore();

      const extractColor = (book) => {
        const img = document.getElementById(book.id);
        if (img && img.complete) {
            const colorThief = new window.ColorThief(); // Use window.ColorThief
            try {
                const dominantColor = colorThief.getColor(img);
                book.bgColor = `rgb(${dominantColor.join(",")})`;
                book.textColor = getBestTextColor(book.bgColor);
            } catch (e) {
                console.warn("Color extraction failed for", book.title);
            }
        }
    };


    const  getBestTextColor = (bgColor) =>{
      console.log(tinycolor(bgColor).isLight())
        return tinycolor(bgColor).isLight() ? "#000000" : "#FFFFFF";
    }

    const pulledOutIndex = ref(null);

    const pullOut = (index) => {
        console.log("Clicked index:", index);
        pulledOutIndex.value = index; // ✅ Fix: Use .value to update ref
        console.log("Updated pulledOutIndex:", pulledOutIndex.value);

        setTimeout(() => {
            pulledOutIndex.value = null; // ✅ Fix: Reset after 5s
        }, 5000);
    };


    return { store, extractColor, pullOut, pulledOutIndex };
  },
};
</script>

<style>
.scene {
            perspective: 1000px;
        }

        .book-container {
            position: relative;
            align-items: center;
            transform: rotateY(0deg);

            background: rgb(35, 42, 51);

            transform-origin: rights;
        }

        .spine {
            display: flex;
            align-items: center;
            justify-content: center;
            writing-mode: vertical-rl;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            /* border-radius: 5px; */
            z-index: 2;

            overflow: hidden;

            padding: 1em;
        }

        .left-cover {
            position: absolute;
            left: 0;
            height: 100%;
            width: auto; /* Auto width based on height */
            transform-origin: left;
            transform: rotateY(-90deg) translatex(-100%); /* Hides the cover */

            z-index: 1;

            max-width: unset;
        }

        .right-cover {
            position: absolute;
            right: 0;
            height: 100%;
            width: 50px;
            transform-origin: right;
            transform: rotateY(-90deg);
            background: rgb(35, 42, 51);
            z-index: 1;
        }

        @keyframes pullOutAndRotate {
            0% {
                transform: rotateY(0deg);
            }

            15% {
                transform: rotateY(0deg) scale(1.25) translatex(-25px); /* Pull out effect */
            }

            30% {
                transform: rotateY(90deg) scale(1.25) translatex(-25px); /* Pull out effect */
            }
            
            70% {
                transform: rotateY(90deg) scale(1.25) translatex(-25px); /* Pull out effect */
            }

            85% {
                transform: rotateY(0deg) scale(1.25) translatex(-25px);
            }
            100% {
                transform: rotateY(0deg);  /* Rotate to 80deg */
            }
        }

        .pulling-out {
            animation: pullOutAndRotate 5s ease-in-out forwards;
            transform-style: preserve-3d;
        }
</style>
