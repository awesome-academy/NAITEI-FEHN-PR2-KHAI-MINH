<template>
  <div
    class="relative w-full pt-[var(--header-height)] -mt-[var(--header-height)]"
  >
    <swiper
      v-if="movies && movies.length > 0"
      :modules="[EffectFade, Mousewheel, Navigation, Pagination, Autoplay]"
      effect="fade"
      :fadeEffect="{ crossFade: true }"
      :loop="movies.length > 1"
      :autoplay="
        movies.length > 1 ? { delay: 7000, disableOnInteraction: true } : false
      "
      :mousewheel="{ forceToAxis: true, sensitivity: 0.5 }"
      :grabCursor="true"
      @slideChange="onSlideChange"
      @swiper="onSwiper"
      class="w-full h-full hero-swiper"
      :navigation="
        movies.length > 1
          ? {
              nextEl: '.hero-swiper-button-next',
              prevEl: '.hero-swiper-button-prev',
            }
          : false
      "
      :pagination="
        movies.length > 1
          ? { el: '.hero-swiper-pagination', clickable: true }
          : false
      "
    >
      <swiper-slide
        v-for="(currentMovie, index) in movies"
        :key="currentMovie.id || index"
        class="relative"
      >
        <div class="absolute inset-0 w-full h-full">
          <img
            :src="currentMovie.coverImage || currentMovie.poster"
            :alt="`Background for ${currentMovie.name}`"
            class="w-full h-full object-cover object-center"
            @error="onImageError"
          />
          <div
            class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent opacity-80 md:opacity-100"
          ></div>
          <div
            class="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
          ></div>
          <div
            class="absolute bottom-0 left-0 right-0 h-1/2 sm:h-2/3 bg-gradient-to-t from-pb-background via-pb-background/70 to-transparent"
          ></div>
        </div>

        <div
          class="relative z-10 w-full px-4 sm:px-14 lg:px-19 py-16 md:py-24 flex flex-row justify-between items-end hero-slide-content"
        >
          <div class="md:w-2/3 lg:w-3/5 xl:w-1/2">
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight text-white"
            >
              {{ currentMovie.name }}
            </h1>
            <p
              v-if="currentMovie.subname"
              class="text-base sm:text-lg md:text-xl text-gray-200 mb-4 md:mb-6 text-green-500"
            >
              {{ currentMovie.subname }}
            </p>

            <div
              class="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 md:mb-6 text-xs sm:text-sm text-gray-300"
            >
              <span
                v-if="currentMovie.ageRating"
                class="px-2 py-0.5 border border-gray-400 text-gray-200 rounded text-xs"
              >
                {{ currentMovie.ageRating }}
              </span>
              <span v-if="currentMovie.releaseYear">{{
                currentMovie.releaseYear !== 1970
                  ? currentMovie.releaseYear
                  : "N/A"
              }}</span>
              <span v-if="currentMovie.duration"
                >{{ currentMovie.duration }} phút</span
              >
              <span v-if="currentMovie.ApiFilmType">{{
                currentMovie.ApiFilmType
              }}</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-4 md:mb-6">
              <span
                v-for="genre in currentMovie.genres"
                :key="genre"
                class="px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-200 rounded-full text-xs font-medium"
              >
                {{ genre }}
              </span>
            </div>

            <p
              class="text-gray-300 leading-relaxed mb-6 md:mb-8 text-sm md:text-base line-clamp-3"
            >
              {{ currentMovie.description }}
            </p>

            <div class="flex flex-wrap items-center gap-3 md:gap-4">
              <button
                @click="playTrailer(currentMovie)"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 sm:px-6 rounded-lg flex items-center text-xs sm:text-sm md:text-base transition-transform hover:scale-105"
              >
                <Icon
                  icon="solar:play-bold"
                  class="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                />
                Đặt vé ngay
              </button>
              <button
                @click="toggleFavorite(currentMovie.id)"
                class="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-3 sm:px-5 rounded-lg flex items-center text-xs sm:text-sm md:text-base transition-transform hover:scale-105"
              >
                <Icon
                  :icon="
                    isFavorite(currentMovie.id)
                      ? 'solar:heart-bold'
                      : 'solar:heart-outline'
                  "
                  class="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                  :class="{ 'text-pink-500': isFavorite(currentMovie.id) }"
                />
                Yêu thích
              </button>
              <NuxtLink
                :to="`/phim/${currentMovie.id}`"
                class="border border-white/20 hover:bg-white/10 backdrop-blur-sm text-white font-semibold py-2.5 px-3 sm:px-5 rounded-lg flex items-center text-xs sm:text-sm md:text-base transition-transform hover:scale-105"
              >
                <Icon
                  icon="solar:info-circle-outline"
                  class="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                />
                Chi tiết
              </NuxtLink>
            </div>
          </div>
          <div
            class="z-20 hidden md:flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity"
          >
            <img
              v-for="(thumbMovie, thumbIndex) in getThumbnails()"
              :key="`thumb-${thumbMovie.id}-${thumbIndex}`"
              :src="thumbMovie.coverImage || thumbMovie.poster"
              :alt="`Thumbnail for ${thumbMovie.name}`"
              @error="onImageError"
              :class="[
                'w-15 h-12 object-cover rounded-md border-2 hover:border-green-500 cursor-pointer',
                thumbIndex === index ? 'border-green-500' : '',
              ]"
              @click="goToSlide(thumbMovie.id)"
            />
          </div>
        </div>
      </swiper-slide>

      <div v-if="movies && movies.length > 1">
        <div
          class="swiper-button-prev hero-swiper-button left-2 sm:left-4"
        ></div>
        <div
          class="swiper-button-next hero-swiper-button right-2 sm:right-4"
        ></div>
      </div>
      <div
        v-if="movies && movies.length > 1"
        class="swiper-pagination hero-swiper-pagination"
      ></div>
    </swiper>
    <div v-else class="h-screen flex items-center justify-center bg-slate-900">
      <p class="text-white text-xl">Không có phim nào để hiển thị.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { PropType } from "vue";
import SwiperCore from "swiper"; // Import SwiperCore
import { Swiper, SwiperSlide } from "swiper/vue";
import {
  EffectFade,
  Mousewheel,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Icon } from "@iconify/vue";
import type { Movie } from "@/types/movie.type";

const props = defineProps({
  movies: {
    type: Array as PropType<Movie[]>,
    required: true,
    default: () => [],
  },
  headerHeight: {
    type: Number,
    default: 80,
  },
});

const swiperInstance = ref<SwiperCore | null>(null);

const onSwiper = (swiper: SwiperCore) => {
  swiperInstance.value = swiper;
};

const activeMovieIndex = ref(0);
const favoriteMovies = ref<Set<string>>(new Set());

const onSlideChange = (swiper: SwiperCore) => {
  activeMovieIndex.value = swiper.realIndex;
};

const playTrailer = (movie: Movie) => {
  if (
    movie.trailerUrl &&
    movie.trailerUrl !==
      "https://homepage.momocdn.net/default/s/no-image-momo.jpg" &&
    movie.trailerUrl !== "https://youtu.be/dblbocy0M-o"
  ) {
    window.open(movie.trailerUrl, "_blank");
  } else {
    alert("Không tìm thấy trailer cho phim này.");
  }
};

const isFavorite = (movieId: string) => favoriteMovies.value.has(movieId);
const toggleFavorite = (movieId: string) => {
  if (favoriteMovies.value.has(movieId)) favoriteMovies.value.delete(movieId);
  else favoriteMovies.value.add(movieId);
};

const defaultPlaceholder =
  "https://via.placeholder.com/300x450.png?text=No+Image";
const onImageError = (event: Event) => {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = defaultPlaceholder;
};
const getThumbnails = () => {
  if (!props.movies || props.movies.length <= 1) return [];
  return props.movies;
};

const goToSlide = (movieId: string) => {
  if (swiperInstance.value) {
    const movieIndex = props.movies.findIndex((movie) => movie.id === movieId);
    if (movieIndex !== -1) {
      swiperInstance.value.slideToLoop(movieIndex);
    }
  }
};
</script>

<style>
.relative.w-full {
  padding-top: var(--header-height) !important;
  margin-top: calc(-1 * var(--header-height)) !important;
}
.hero-swiper {
  width: 100%;
  height: 100%;
}
.hero-swiper .swiper-slide {
  display: flex;
  align-items: flex-end;
  min-height: 75vh;
  max-height: 90vh;
}
@media (min-width: 768px) {
  .hero-swiper .swiper-slide {
    min-height: 70vh;
  }
}
.hero-slide-content {
  padding-bottom: 4rem;
}
@media (min-width: 768px) {
  .hero-slide-content {
    padding-bottom: 6rem;
  }
}

.hero-swiper-button {
  display: none !important;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  width: 36px !important;
  height: 36px !important;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  opacity: 0.7;
}
.hero-swiper-button:hover {
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 1;
}
.hero-swiper-button::after {
  font-size: 16px !important;
  font-weight: bold;
}

/* Ẩn nút khi chỉ có 1 slide */
.swiper-button-disabled {
  display: none !important;
}

.hero-swiper-pagination .swiper-pagination-bullet {
  background-color: rgba(255, 255, 255, 0.4);
  width: 8px;
  height: 8px;
  opacity: 0.7;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}
.hero-swiper-pagination .swiper-pagination-bullet-active {
  background-color: #fff;
  opacity: 1;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
