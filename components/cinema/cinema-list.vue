<template>
  <div class="h-full w-1/4 mt-8">
    <div class="p-3 w-full">
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <Icon
            icon="heroicons:magnifying-glass-20-solid"
            class="w-5 h-5 text-gray-400"
          />
        </div>
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Tìm theo tên rạp ..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-600"
        />
      </div>
    </div>

    <ul
      v-if="filteredCinemas.length > 0"
      class="overflow-y-auto overflow-x-hidden max-h-[calc(40vh-10px)]"
    >
      <CinemaItem
        v-for="cinema in filteredCinemas"
        :key="cinema.id"
        :cinema="cinema"
        :is-highlighted="cinema.id === props.currentCinemaId"
        @item-click="handleItemClick"
        @click="props.onSelectCinema(cinema)"
      />
    </ul>
    <div v-else class="p-4 text-center text-gray-500">
      Không tìm thấy rạp nào phù hợp.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from "vue";
import { Icon } from "@iconify/vue";
import type { Cinema } from "@/types/cinema.type.ts";
import CinemaItem from "@/components/cinema/cinema-item.vue";

const props = defineProps({
  initialCinemas: {
    type: Array as PropType<Cinema[]>,
    required: true,
    default: () => [],
  },
  onSelectCinema: {
    type: Function as PropType<(cinema: Cinema) => void>,
    required: true,
  },

  currentCinemaId: {
    type: String,
    required: true,
  },
});

const searchTerm = ref("");

const filteredCinemas = computed(() => {
  if (!searchTerm.value.trim()) {
    return props.initialCinemas;
  }
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase().trim();
  return props.initialCinemas.filter((cinema) =>
    cinema.name.toLowerCase().includes(lowerCaseSearchTerm)
  );
});

const handleItemClick = (cinemaId: string) => {
  console.log("Cinema clicked in CinemaList:", cinemaId);
};
</script>

<style scoped>
.max-h-\[calc\(100vh-250px\)\]::-webkit-scrollbar {
  width: 6px;
}
.max-h-\[calc\(100vh-250px\)\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.max-h-\[calc\(100vh-250px\)\]::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.max-h-\[calc\(100vh-250px\)\]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
