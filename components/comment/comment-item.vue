<template>
  <div
    class="flex items-start p-3 bg-slate-800 text-white rounded-lg shadow-md max-w-sm sm:max-w-md hover:border border-green-300 cursor-pointer"
  >
    <div class="mr-3 flex-shrink-0">
      <img
        :src="review.user.avatarUrl"
        :alt="review.username"
        class="w-10 h-10 rounded-full object-cover"
        referrerpolicy="no-referrer"
      />
    </div>

    <div class="flex-grow overflow-hidden">
      <div class="mb-1">
        <p class="text-sm truncate">
          <strong class="font-semibold text-gray-100">{{
            review.username
          }}</strong>
          <span class="text-gray-300 ml-1">{{ review.content }}</span>
        </p>
      </div>

      <div class="flex items-center text-xs text-gray-400 mt-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4 mr-1.5 shrink-0"
          aria-hidden="true"
        >
          <path
            d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z"
          />
        </svg>
        <span class="truncate">{{ review.movie.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentData } from "@/types/comment.type";

defineProps<{
  review: CommentData;
}>();
</script>
