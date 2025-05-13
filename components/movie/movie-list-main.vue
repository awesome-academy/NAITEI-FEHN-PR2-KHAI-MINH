<template>
  <div class="relative w-full group">
    <swiper
      :modules="[Navigation, A11y]"
      :slides-per-view="3"
      :space-between="16"
      :navigation="{
        nextEl: '.swiper-button-next-custom2',
        prevEl: '.swiper-button-prev-custom2',
      }"
      :breakpoints="{
        640: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 6,
        },
        1280: {
          slidesPerView: 8,
        },
      }"
      class="w-full"
    >
      <swiper-slide v-for="movie in movies" :key="movie.id">
        <MovieItem :movie="movie" />
      </swiper-slide>
    </swiper>

    <button
      aria-label="Previous slide"
      class="swiper-button-prev-custom2 absolute top-1/3 -translate-y-1/2 -left-10 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
    <button
      aria-label="Next slide"
      class="swiper-button-next-custom2 absolute top-1/3 -translate-y-1/2 -right-10 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from "@/types/movie.type.ts";
import MovieItem from "@/components/movie/movie-item.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/a11y";

import { Navigation, A11y } from "swiper/modules";

interface Props {
  movies: Movie[];
}

const props = defineProps<Props>();
</script>

<style>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-button-disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
