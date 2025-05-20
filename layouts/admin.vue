<template>
  <div class="h-screen" style="scrollbar-width: none; -ms-overflow-style: none">
    <div
      class="flex flex-col lg:flex-row mx-auto h-full w-full justify-start items-start overflow-hidden"
    >
      <UserSidebar class="w-full lg:w-auto mb-4 lg:mb-0" />
      <slot :headerHeight="actualHeaderHeight" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import UserSidebar from "@/components/admin/admin-sidebar.vue";

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
