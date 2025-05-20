<template>
  <NuxtLink
    :to="to"
    class="flex items-center py-2.5 rounded-md transition-colors duration-150 ease-in-out hover:text-green-500 group"
    active-class="text-yellow-400 font-semibold shadow-sm"
  >
    <Icon
      :icon="icon"
      class="w-5 h-5 mr-3 text-gray-400 group-hover:text-green-500 transition-colors"
      :class="{ 'text-green-500': $route.path === to }"
    />
    <div :class="{ 'text-green-500': $route.path === to }">
      {{ label }}
    </div>
  </NuxtLink>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";

defineProps({
  to: String,
  label: String,
  icon: String,
});

const route = useRoute();
</script>
