<template>
  <main class="w-full">
    <HeroSection :movies="movies.slice(0, 5)" :header-height="headerHeight" />
    <div class="w-full pt-4 px-12">
      <h2 class="text-2xl font-semibold mb-8 text-gray-800 dark:text-white">
        Phim đang chiếu
      </h2>
      <MovieListMain :movies="movies" />
    </div>
    <div class="w-full px-12 mb-12">
      <h2 class="text-2xl font-semibold mb-8 text-gray-800 dark:text-white">
        Phim sắp chiếu
      </h2>
      <MovieList2 :movies="movies" />
    </div>
    <showTimesMain />
  </main>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import HeroSection from "@/components/slider/hero-section.vue";
import MovieListMain from "@/components/movie/movie-list-main.vue";
import MovieList2 from "@/components/movie/movie-list-2.vue";
import type { Movie } from "@/types/movie.type.ts";
import axios from "axios";
import showTimesMain from "@/components/showtimes/show-times-main.vue";

const props = defineProps({
  headerHeight: {
    type: Number,
    default: 80,
  },
});
const movies = ref<Movie[]>([]);

async function fetchMovies(): Promise<void> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API}/movies`
    );
    movies.value = response.data;
  } catch (error) {
    console.error("Lỗi khi fetch movies:", error);
  }
}

onMounted(async () => {
  await fetchMovies();
});
</script>
