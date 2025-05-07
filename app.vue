<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Rổ Phim`
      : "Rổ Phim - Xem phim miễn phí";
  },
  htmlAttrs: {
    lang: "vi",
    class: "dark" // Add this line
  },
});
</script>
<style lang="postcss" global>
html,
body {
  @apply bg-pb-background text-pb-text;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* Font mặc định của Tailwind */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  @apply bg-pb-surface/50;
}
::-webkit-scrollbar-thumb {
  @apply bg-pb-accent/70 rounded;
}
::-webkit-scrollbar-thumb:hover {
  @apply bg-pb-accent;
}
</style>
