<template>
  <div class="bg-pb-background rounded-xl shadow-lg overflow-hidden flex flex-col h-full">

    <div class="relative">
      <img
        :src="review.movie.posterUrl"
        :alt="`Poster for ${review.movie.title}`"
        class="w-full h-56 object-cover "
      />
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300"
      >
        <Icon icon="mdi:play-circle" class="text-pb-text text-7xl" />
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent"
      >
        <h3 class="text-pb-text text-lg font-semibold truncate" :title="review.movie.title">
          {{ review.movie.title }}
        </h3>
        <div class="flex items-center justify-between mt-1 text-xs">
          <div class="flex items-center text-pb-text">
            <span class="bg-pb-accent text-pb-background text-xs font-bold px-1.5 py-0.5 rounded-sm mr-1.5">
              CGV
            </span>
            <span v-if="review.movie.rating !== null">{{ review.movie.rating.toFixed(1) }}</span>
            <span v-else>0</span>
            <Icon icon="ph:star-bold" class="ml-1 h-4 w-4  text-yellow-500"  />
          </div>

        </div>
      </div>
    </div>


    <div class="p-4 flex-grow flex flex-col">
      <div class="space-y-3 flex-grow">
        <div v-for="comment in review.comments" :key="comment.id" class="comment-item">
          <div class="flex items-start mb-1">
            <img
              :src="comment.avatarUrl"
              alt="User avatar"
              class="w-8 h-8 rounded-full mr-2.5 mt-0.5"
            />
            <div class="flex-1">
              <div class="flex items-baseline justify-between">
                 <p class="text-xs text-pb-text-secondary">
                    <span class="font-semibold text-pb-text">{{ comment.userName }}</span>
                    <span class="text-pb-text-secondary ml-1.5">{{ comment.date }}</span>
                 </p>
              </div>

            </div>
          </div>
          <p class="text-pb-text-secondary text-sm line-clamp-3 leading-relaxed pl-10 -mt-2">
            {{ comment.text }}
          </p>
        </div>
      </div>

      <div class="mt-auto pt-3 text-right">
        <a
          :href="`/review-phim/${review.id}`"
          class="text-pb-accent hover:cursor-pointer hover:opacity-80 font-semibold text-sm inline-flex items-center transition-opacity"
        >
          Xem thêm
          <Icon icon="mdi:arrow-right" class="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface DisplayComment {
  id: string;
  avatarUrl: string;
  userName: string;
  date: string;
  text: string;
}

interface DisplayMovie {
  title: string;
  posterUrl: string;
  rating: number | null;
}

interface DisplayReview {
  id: string;
  movie: DisplayMovie;
  comments: DisplayComment[];
}

defineProps<{
  review: DisplayReview;
}>();
</script>

<style scoped>
.comment-item:not(:last-child) {
  margin-bottom: 0.75rem;
}
</style>
