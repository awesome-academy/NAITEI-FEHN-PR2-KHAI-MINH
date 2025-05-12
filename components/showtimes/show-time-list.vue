<template>
  <div class="h-full flex-1 mt-8 px-2">
    <ul
      v-if="showtimes.length > 0"
      class="overflow-y-auto overflow-x-hidden max-h-[calc(46vh-11px)]"
    >
      <ShowtimeDisplayCard
        v-for="showtimeItem in showtimes"
        :key="showtimeItem.id"
        :showtime="showtimeItem"
        @select-showtime="handleShowtimeSelectedInCard"
      />
    </ul>
    <div v-else class="p-4 text-center text-gray-500">
      <p>Không có suất chiếu nào khả dụng.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShowtimeDisplayCard from "@/components/showtimes/show-time-item.vue";
import type { ShowTimeDataItem } from "@/types/show-time.type";

interface Props {
  showtimes: ShowTimeDataItem[];
}

defineProps<Props>();

const emit = defineEmits(["showtime-selected-from-list"]);

const handleShowtimeSelectedInCard = (selectedShowtime: ShowTimeDataItem) => {
  emit("showtime-selected-from-list", selectedShowtime);
};
</script>
