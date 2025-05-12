<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
    :class="{
      'bg-slate-900/90 shadow-lg backdrop-blur-md': isScrolled,
      'bg-transparent': !isScrolled,
    }"
    ref="appHeader"
  >
    <nav
      class="w-full mx-auto px-10 sm:px-8 lg:px-10 py-5 flex items-center justify-between"
    >
      <div class="flex items-center">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <img
              src="https://reka-ui.com/logo.svg"
              alt="Logo"
              class="h-10 w-auto mr-2 sm:mr-3"
            />
            <span
              class="text-xl font-bold"
              :class="isScrolled ? 'text-gray-100' : 'text-white'"
            >
              RoPhim
            </span>
          </NuxtLink>
        </div>

        <NavigationMenuRoot
          v-model="currentTrigger"
          class="relative z-[1] flex justify-center ml-4 sm:ml-6"
        >
          <NavigationMenuList
            class="center m-0 flex list-none rounded-lg p-1 transition-colors duration-300"
            :class="{
              'bg-white/10 backdrop-blur-md shadow-sm': !isScrolled,
              'bg-slate-700/50': isScrolled,
            }"
          >
            <NavigationMenuItem
              v-for="item in navigationItems"
              :key="item.name"
            >
              <NavigationMenuTrigger
                v-if="item.children && item.children.length > 0"
                class="font-medium group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm leading-none outline-none focus:shadow-[0_0_0_2px]"
                :class="itemTextClass"
                @click="currentTrigger = item.name"
              >
                {{ item.name }}
                <Icon
                  icon="radix-icons:caret-down"
                  class="relative top-[1px] transition-transform duration-[150ms] ease-in group-data-[state=open]:-rotate-180"
                  :class="itemTextClass"
                  aria-hidden
                />
              </NavigationMenuTrigger>
              <NuxtLink
                v-else
                :to="item.href"
                custom
                v-slot="{ navigate, href }"
              >
                <NavigationMenuLink
                  :href="href"
                  @click="navigate"
                  class="block select-none rounded-[4px] px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]"
                  :class="[
                    itemTextClass,
                    isActive(item.href)
                      ? isScrolled
                        ? 'bg-green-500 !text-white'
                        : 'bg-green-600/70 !text-white font-semibold'
                      : isScrolled
                      ? 'hover:bg-slate-600/80'
                      : 'hover:bg-white/20',
                  ]"
                >
                  {{ item.name }}
                </NavigationMenuLink>
              </NuxtLink>

              <NavigationMenuContent
                v-if="item.children && item.children.length > 0"
                class="absolute top-0 left-0 w-auto data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight"
              >
                <ul
                  class="m-0 list-none gap-x-[10px] sm:grid sm:grid-cols-2 p-[12px] sm:w-[600px]  rounded-md border border-gray-200 border-slate-700"
                >
                  <li class="row-span-4 grid">
                    <NavigationMenuLink as-child>
                      <a
                        class="focus:shadow-green-700 bg-slate-100 dark:bg-slate-900 flex h-full w-full select-none flex-col justify-end rounded-lg p-[25px] no-underline outline-none focus:shadow-[0_0_0_2px]"
                        href="/"
                      >
                        <img class="w-16" src="https://reka-ui.com/logo.svg" />
                        <div
                          class="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-slate-900 dark:text-white"
                        >
                          Rổ phim
                        </div>
                        <p
                          class="text-slate-500 dark:text-slate-400 text-[14px] leading-[1.3]"
                        >
                          Rổ phim là một trang web cung cấp thông tin về lịch
                          chiếu phim, rạp chiếu.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li v-for="child in item.children" :key="child.name">
                    <NuxtLink
                      :to="child.href"
                      custom
                      v-slot="{ navigate, href: childHref }"
                    >
                      <NavigationMenuLink
                        :href="childHref"
                        @click="
                          navigate();
                          currentTrigger = '';
                        "
                        class="block select-none rounded-[4px] px-3 py-2 text-sm leading-none no-underline outline-none focus:shadow-[0_0_0_2px]"
                        :class="[
                          'text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 focus:shadow-green-500/50',
                          isActive(child.href)
                            ? 'bg-green-100 dark:bg-green-700/50 text-green-700 dark:text-green-300 font-semibold'
                            : '',
                        ]"
                      >
                        {{ child.name }}
                      </NavigationMenuLink>
                    </NuxtLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuIndicator
              class="absolute data-[state=hidden]:opacity-0 duration-200 data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full w-[--reka-navigation-menu-indicator-size] translate-x-[--reka-navigation-menu-indicator-position] mt-[1px] z-[100] flex h-[10px] items-end justify-center overflow-hidden transition-[all,transform_250ms_ease]"
            >
              <div
                class="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] border border-gray-300 dark:border-slate-700"
                :class="
                  isScrolled ? 'bg-gray-100 dark:bg-slate-800' : 'bg-white/50'
                "
              />
            </NavigationMenuIndicator>
          </NavigationMenuList>

          <div
            class="perspective-[2000px] absolute top-full left-0 flex w-full justify-center"
          >
            <NavigationMenuViewport
              class="data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--reka-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-lg bg-white dark:bg-slate-800 transition-[width,_height] duration-300 sm:w-[var(--reka-navigation-menu-viewport-width)] border dark:border-slate-700 shadow-lg"
            />
          </div>
        </NavigationMenuRoot>
      </div>

      <div class="flex items-center">
        <div class="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            class="px-2.5 sm:px-3 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 text-xs sm:text-sm pr-8 sm:pr-10 transition-colors duration-300"
            :class="
              isScrolled
                ? 'bg-slate-700/80 border-slate-600 focus:ring-green-500 focus:border-transparent text-gray-200 placeholder-gray-400'
                : 'bg-white/20 backdrop-blur-md border-white/30 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-300'
            "
          />
          <div
            class="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none"
          >
            <Icon
              icon="radix-icons:magnifying-glass"
              class="h-4 w-4 sm:h-5 sm:w-5"
              :class="isScrolled ? 'text-gray-400' : 'text-gray-300'"
            />
          </div>
        </div>
        <NuxtLink
          to="/login"
          class="ml-2 sm:ml-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-300 flex items-center"
          :class="
            isScrolled
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-white/90 hover:bg-white text-green-700'
          "
        >
          <Icon
            icon="radix-icons:person"
            class="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"
          />
          Thành viên
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "#imports";
import { Icon } from "@iconify/vue";
import {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "reka-ui";

const route = useRoute();
const isScrolled = ref(false);
const appHeader = ref<HTMLElement | null>(null);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

defineExpose({ element: appHeader });

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

const navigationItems = ref<NavItem[]>([
  {
    name: "Lịch chiếu",
    href: "/lich-chieu",
  },
  {
    name: "Rạp chiếu",
    href: "/rap-chieu",
    children: [
      { name: "Rạp CGV", href: "/rap-chieu/cgv" },
      { name: "Rạp Lotte", href: "/rap-chieu/lotte" },
      { name: "Rạp BHD", href: "/rap-chieu/bhd" },
    ],
  },
  { name: "Phim chiếu", href: "/phim-chieu" },
  { name: "Review phim", href: "/review-phim" },
  { name: "Top phim", href: "/top-phim" },
  {
    name: "Blog phim",
    href: "/blog-phim",
    children: [
      { name: "Tin tức điện ảnh", href: "/blog-phim/tin-tuc" },
      { name: "Phim chiếu rạp", href: "/blog-phim/goc-nhin" },
      { name: "Tổng hợp phim", href: "/blog-phim/phim-truyen-hinh" },
    ],
  },
]);

const currentTrigger = ref("");
const isActive = (href: string) => {
  if (href === "/") return route.path === href;
  return route.path === href || route.path.startsWith(href + "/");
};

const itemTextClass = computed(() => {
  return isScrolled.value
    ? "text-gray-200 hover:text-green-400 focus:shadow-green-500/50"
    : "text-white hover:text-gray-200 focus:shadow-white/50";
});
</script>
