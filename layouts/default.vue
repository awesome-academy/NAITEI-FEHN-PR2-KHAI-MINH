<template>
  <div>
    <AppHeader ref="pageHeaderRef" />
    <main><slot :headerHeight="actualHeaderHeight" /></main>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import AppHeader from "@/components/app/header.vue";
const pageHeaderRef = ref(null);
const actualHeaderHeight = ref(80);
onMounted(async () => {
  await nextTick();
  if (pageHeaderRef.value && pageHeaderRef.value.element) {
    actualHeaderHeight.value = pageHeaderRef.value.element.clientHeight;
  } else {
    const headerDOM = document.querySelector("header");
    if (headerDOM) {
      actualHeaderHeight.value = headerDOM.clientHeight;
    }
  }
});
</script>
