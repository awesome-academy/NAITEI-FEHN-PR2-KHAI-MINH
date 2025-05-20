<template>
  <NuxtLink
    :to="to"
    class="flex items-center py-2.5 px-4 pr-12 rounded-md transition-colors duration-150 ease-in-out hover:bg-green-500 hover:text-white group text-sm"
    active-class=" bg-green-500 text-white shadow-md"
  >
    <Icon
      :icon="icon"
      class="w-5 h-5 mr-3 text-gray-400 group-hover:text-white transition-colors"
      :class="{
        'text-white font-semibold':
          $route.path === to || $route.path.startsWith(to + '/'),
      }"
    />
    <span
      :class="{
        'text-white': $route.path === to || $route.path.startsWith(to + '/'),
      }"
      >{{ label }}</span
    >
  </NuxtLink>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";

defineProps({
  to: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const route = useRoute();
</script>
