<template>
  <div
    class="movie-card relative rounded-lg overflow-hidden shadow-xl cursor-pointer group w-full max-w-sm mx-auto bg-gray-800 text-white bg-opacity-0 transition-opacity"
    @click="onCick(movie.id)"
  >
    <div class="relative h-48 md:h-56">
      <img
        v-if="movie.coverImage"
        :src="movie.coverImage"
        :alt="`Ảnh bìa ${movie.name}`"
        class="absolute inset-0 w-full h-full object-cover transition-t0ransform duration-50 ease-in-out"
        @error="onImageError($event, 'cover')"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"
      ></div>
    </div>

    <div class="relative p-4 flex space-x-4 -mt-20 md:-mt-24 z-10">
      <div class="flex-shrink-0 w-24 h-36 md:w-28 md:h-40 -mt-8">
        <img
          v-if="movie.poster"
          :src="movie.poster"
          :alt="`Poster ${movie.name}`"
          class="rounded-md shadow-lg object-cover w-full h-full transition-transform duration-300 ease-in-out"
          @error="onImageError($event, 'poster')"
        />
        <div
          v-else
          class="w-full h-full bg-gray-700 rounded-md flex items-center justify-center text-gray-500 text-xs"
        >
          No Poster
        </div>
      </div>

      <div class="flex-grow pt-10 md:pt-12 min-w-0">
        <h2
          class="text-lg md:text-xl font-bold truncate transition-colors duration-300"
          :title="movie.name"
        >
          {{ movie.name }}
        </h2>
        <p
          v-if="movie.subname && movie.subname !== movie.name"
          class="text-xs text-gray-300 truncate"
          :title="movie.subname"
        >
          {{ movie.subname }}
        </p>

        <div class="mt-2 flex items-center space-x-2 text-xs text-gray-400">
          <span
            v-if="movie.ageRating"
            class="px-2 py-0.5 bg-gray-700 text-yellow-400 border border-yellow-500 rounded text-xs font-semibold"
          >
            {{ movie.ageRating }}
          </span>
          <span
            v-else
            class="px-2 py-0.5 bg-gray-700 text-gray-300 border border-gray-600 rounded text-xs"
          >
            N/A
          </span>
          <span>{{ movie.releaseYear }}</span>
          <span>•</span>
          <span>{{ formatDuration(movie.duration) }}</span>
        </div>

        <div
          v-if="
            movie.rating &&
            typeof movie.rating.RatingValue === 'number' &&
            movie.rating.RatingValue > 0
          "
          class="mt-2 flex items-center"
        >
          <StarIcon class="w-4 h-4 text-yellow-400 mr-1" />
          <span class="text-sm font-semibold">{{
            movie.rating.RatingValue.toFixed(1)
          }}</span>
          <span class="text-xs text-gray-400 ml-1"
            >({{ movie.rating.RatingCount }} đánh giá)</span
          >
        </div>
        <p v-else class="mt-2 text-xs text-gray-400">Chưa có đánh giá</p>
      </div>
    </div>

    <div class="px-4 pb-3 pt-1 z-10 relative">
      <div
        v-if="movie.genres && movie.genres.length > 0"
        class="flex flex-wrap gap-1.5 mt-2"
      >
        <span
          v-for="genre in movie.genres.slice(0, 3)"
          :key="genre"
          class="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600"
        >
          {{ genre }}
        </span>
      </div>
    </div>
    <div
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 opacity-0 hover:opacity-100"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon } from "@heroicons/vue/24/solid";
import type { Movie } from "@/types/movie.type";
import { formatDuration } from "~/lib/utils";
const props = defineProps<{
  movie: Movie;
  onCick: (movieId: string) => void;
}>();

const onImageError = (event: Event, type: "poster" | "cover") => {
  const target = event.target as HTMLImageElement;
  target.src = `https://via.placeholder.com/300x450?text=${
    type === "poster" ? "No+Poster" : "No+Cover"
  }`;
  console.warn(
    `Lỗi tải ${type} cho phim: ${props.movie.name}. Thay thế bằng placeholder.`
  );
};
</script>
