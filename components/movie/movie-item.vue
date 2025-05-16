<template>
  <UCard
    class="cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:z-10"
    @click="onCick(movie.id)"
  >
    <div class="relative w-full h-80">
      <img
        :src="movie.poster"
        :alt="movie.name"
        class="w-full h-full object-cover rounded-md"
      />
    </div>

    <div class="px-2 py-4">
      <h3 class="text-base font-semibold mb-2">{{ movie.name }}</h3>
      <p class="text-sm text-gray-500 mb-1">{{ movie.subname }}</p>
      <p class="text-sm text-gray-500">Thời lượng: {{ movie.duration }} phút</p>
    </div>

    <template #footer>
      <UButton block color="primary" @click="viewDetails">Xem chi tiết</UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { Movie } from "@/types/movie.type";
interface Props {
  movie: Movie;
  onCick: (movieId: string) => void;
}

const props = defineProps<Props>();

const viewDetails = () => {
  console.log("Xem chi tiết phim:", props.movie.id);
};
</script>

<style scoped>
.u-card img {
  border-radius: inherit;
}
</style>
