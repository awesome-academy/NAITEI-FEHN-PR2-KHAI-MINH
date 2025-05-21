<template>
  <div
    class="flex flex-1 bg-gray-900 p-4 md:p-8 lg:p-12 flex-col min-h-screen overflow-hidden"
  >
    <CinemaList />
  </div>
</template>

<script setup lang="ts">
import CinemaList from "~/components/admin/cinemas/cinema-list.vue";

definePageMeta({
  layout: "admin",
});
</script>

<style>
/* Optional: Global styles for your page/app */
body {
  background-color: #0a0e14; /* Dark background for the page */
  color: #e5e7eb;
  font-family: "Inter", sans-serif; /* Assuming you use Inter like in previous examples */
}
</style>
