﻿<template>
  <aside
    class="w-[22rem] bg-[#27293D] text-gray-300 p-6 flex flex-col shadow-lg rounded-2xl h-full"
  >
    <h2 class="text-xl font-semibold mb-8 text-white">Quản lý tài khoản</h2>

    <nav class="flex-grow space-y-1.5">
      <SidebarLink to="/user/favorites" icon="mdi:heart" label="Yêu thích" />
      <SidebarLink to="/user/lists" icon="mdi:plus" label="Ticket" />
      <SidebarLink
        to="/user/continue-watching"
        icon="mdi:refresh"
        label="Phim đã xem"
      />
      <SidebarLink to="/user/profile" icon="mdi:account" label="Tài khoản" />
    </nav>

    <div class="mt-auto pt-6 border-t border-slate-700">
      <div class="flex items-center mb-5">
        <img
          :src="currentUser.avatarUrl"
          alt="User Avatar"
          class="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <p class="font-medium text-sm text-white">{{ currentUser.name }}</p>
          <p class="text-xs text-gray-400">{{ currentUser.email }}</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="w-full flex items-center py-2.5 rounded-md transition-colors duration-150 ease-in-out text-gray-300 hover:text-red-500 group"
      >
        <Icon
          icon="mdi:logout"
          class="w-5 h-5 mr-3 text-gray-400 group-hover:text-red-500"
        />
        <span>Thoát</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import SidebarLink from "@/components/user/sidebar-link.vue";
import { useCurrentUser } from "@/lib/utils";

const router = useRouter();
const currentUser = useCurrentUser();

const handleLogout = () => {
  localStorage.clear();
  router.push("/");
};
</script>
