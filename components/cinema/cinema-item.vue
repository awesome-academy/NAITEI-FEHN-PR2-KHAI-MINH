<template>
  <li
    class="flex items-center p-3 pr-6 space-x-3 cursor-pointer group transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] hover:bg-black hover:bg-opacity-20"
    :class="{ 'shadow-lg scale-[1.02] bg-black bg-opacity-20': isHighlighted }"
  >
    <img
      :src="cinema.logo"
      :alt="cinema.name"
      class="w-10 h-10 object-contain rounded flex-shrink-0"
      @error="onImageError"
    />
    <div class="flex flex-col justify-center items-start gap-1">
      <span
        class="flex-grow text-sm transition-colors duration-300"
        :class="{
          'text-green-400': isHighlighted,
          'text-white group-hover:text-green-400': !isHighlighted,
        }"
      >
        {{ cinema.name }}
      </span>

      <span
        class="flex-grow text-xs transition-colors duration-300"
        :class="{
          'text-gray-400': isHighlighted,
          hidden: !isHighlighted,
        }"
      >
        {{ cinema.address }}
      </span>
    </div>
    <Icon
      icon="heroicons:chevron-right-20-solid"
      class="w-5 h-5 text-gray-400 transition-colors duration-300"
      :class="{
        'text-green-400': isHighlighted,
        'group-hover:text-green-500': !isHighlighted,
      }"
    />
  </li>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Cinema } from "@/types/cinema.type.ts";

const props = defineProps<{
  cinema: Cinema;
  isHighlighted?: boolean;
}>();

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "https://via.placeholder.com/40?text=Logo";
  target.alt = `${props.cinema.name} (logo not found)`;
};
</script>
