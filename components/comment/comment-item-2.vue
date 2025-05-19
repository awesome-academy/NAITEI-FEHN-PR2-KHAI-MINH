<template>
  <div class="py-5 text-gray-300">
    <div class="flex items-start mb-4">
      <img
        :src="review.user?.avatarUrl"
        alt="Avatar"
        class="w-8 h-8 rounded-full mr-3 object-cover"
      />
      <div>
        <div class="flex items-center">
          <span class="font-semibold text-sm">{{ review.user?.fullname }}</span>
          <span class="ml-1 text-xs text-gray-500">{{ timeAgo }}</span>
        </div>
      </div>
    </div>
    <p class="text-sm mb-3">
      {{ displayedContent }}
      <span
        v-if="shouldShowReadMore"
        class="text-blue-400 cursor-pointer w-full"
        @click="toggleReadMore"
      >
        {{ isReadMore ? "Thu gọn" : "...Xem thêm" }}
      </span>
    </p>
    <div
      v-if="review.images && review.images.length > 0"
      class="mb-3 overflow-x-auto whitespace-nowrap"
    >
      <img
        v-for="(image, index) in review.images"
        :key="index"
        :src="image"
        :alt="review.content"
        class="inline-block rounded-md object-cover max-h-40 mr-2 last:mr-0"
      />
    </div>
    <div
      v-if="review.keywords && review.keywords.length > 0"
      class="flex flex-wrap gap-2 text-xs text-gray-400"
    >
      <span
        v-for="keyword in review.keywords"
        :key="keyword"
        class="bg-gray-700 rounded-full px-2 py-1"
        >{{ keyword }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentData } from "@/types/comment.type";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ref, computed } from "vue";
import { defineProps } from "vue";

const props = defineProps<{
  review: CommentData;
}>();

const isReadMore = ref(false);
const contentLimit = 200;

const displayedContent = computed(() => {
  if (isReadMore.value || props.review.content.length <= contentLimit) {
    return props.review.content;
  }
  return props.review.content.slice(0, contentLimit) + "...";
});

const shouldShowReadMore = computed(() => {
  return props.review.content.length > contentLimit;
});

const toggleReadMore = () => {
  isReadMore.value = !isReadMore.value;
};

const timeAgo = computed(() => {
  const date = new Date(props.review.createdAt);
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
});
</script>
