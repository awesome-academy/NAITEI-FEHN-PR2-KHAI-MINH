<template>
  <UCard>
    <div class="w-full h-58 flex flex-col md:flex-row gap-4 py-4 px-4">
      <div class="md:w-1/4 lg:w-1/6 flex-shrink-0">
        <div class="relative w-full h-full">
          <img
            :src="showtime.movie.poster"
            :alt="showtime.movie.name"
            class="w-full h-full object-cover rounded-md"
          />
          <span
            v.if="showtime.movie.ageRating"
            class="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded"
          >
            {{ showtime.movie.ageRating }}
          </span>
        </div>
      </div>

      <div class="flex-grow flex flex-col justify-between">
        <div>
          <span class="text-xl font-medium mb-1">
            {{ showtime.movie.name }}
          </span>
          <p class="text-sm text-gray-500 mb-2">
            <span v-for="(genre, index) in showtime.movie.genres" :key="genre">
              {{ genre
              }}<span
                v-if="index < showtime.movie.genres.length - 1"
                class="mx-1"
                >•</span
              >
            </span>
          </p>
          <p class="text-sm text-gray-600 mb-3">
            {{ showtime.movie.ApiFilmType }} Phụ đề
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="showTimeSlot in showtime.showTimesSelect"
            :key="showTimeSlot.id"
            class="border border-green-500 px-2 py-1 rounded-md text-green-500 text-base cursor-pointer hover:bg-green-500 hover:bg-opacity-10"
            block
            color="primary"
          >
            {{ showTimeSlot.showTimeDuration.replace(" ~ ", " - ") }}
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ShowTimeDataItem } from "@/types/show-time.type";

interface Props {
  showtime: ShowTimeDataItem;
}

const props = defineProps<Props>();
</script>

<style scoped>
.u-card img {
  border-radius: inherit;
}

:deep(.dark .dark\:bg-gray-900) {
  background-color: #fff;
}
:deep(.ring-1) {
  --tw-ring-offset-shadow: none !important;
  --tw-ring-shadow: none !important;
  box-shadow: none !important;
}
</style>
