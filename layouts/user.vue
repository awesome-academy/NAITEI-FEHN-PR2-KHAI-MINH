<template>
  <div>
    <AppHeader ref="pageHeaderRef" />
    <div
      class="px-2 sm:px-4 md:px-8 lg:px-12 xl:px-24 h-screen"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <div
        class="flex flex-col lg:flex-row mx-auto px-12 h-full w-full py-8 sm:py-12 md:py-20 lg:py-28 xl:py-36 justify-start items-start gap-4 sm:gap-6 lg:gap-16"
      >
        <UserSidebar class="w-full lg:w-auto mb-4 lg:mb-0" />
        <slot :headerHeight="actualHeaderHeight" />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import AppHeader from "@/components/app/header.vue";
import { useRoute } from "vue-router";
import AppFooter from "@/components/app/footer.vue";
import UserSidebar from "@/components/user/user-sidebar.vue";

const route = useRoute();
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
