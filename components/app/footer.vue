<template>
    <footer
      class="bg-pb-background text-pb-text-secondary container relative flex mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div class="flex-1">
        <div class="mb-6 md:mb-8">
          <span
            class="inline-block bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full"
          >
            <Icon icon="twemoji:star" class="inline-block mr-1 mb-0.5" />
            Chúc bạn xem phim vui vẻ!
          </span>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-6 md:mb-8"
        >
          <div class="flex items-center justify-center md:justify-start">
            <NuxtLink to="/" class="flex items-center">
              <img
                src="https://reka-ui.com/logo.svg"
                alt="Logo RoPhim"
                class="h-12 w-auto mr-3 sm:mr-4"
              />
              <div>
                <span class="text-2xl sm:text-3xl font-bold text-pb-text">
                  RoPhim
                </span>
                <p class="text-xs sm:text-sm text-pb-text-secondary">
                  Phim hay cả rổ
                </p>
              </div>
            </NuxtLink>
          </div>

          <div
            class="flex justify-center md:justify-end items-center space-x-3 sm:space-x-4"
          >
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="text-pb-text-secondary hover:text-pb-accent transition-colors duration-200"
              aria-label="Telegram"
            >
              <Icon icon="logos:telegram" class="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="text-pb-text-secondary hover:text-pb-accent transition-colors duration-200"
              aria-label="Twitter X"
            >
              <Icon icon="simple-icons:x" class="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="text-pb-text-secondary hover:text-pb-accent transition-colors duration-200"
              aria-label="Facebook"
            >
              <Icon icon="logos:facebook" class="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="text-pb-text-secondary hover:text-pb-accent transition-colors duration-200"
              aria-label="TikTok"
            >
              <Icon icon="logos:tiktok-icon" class="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="text-pb-text-secondary hover:text-pb-accent transition-colors duration-200"
              aria-label="YouTube"
            >
              <Icon icon="logos:youtube-icon" class="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="text-pb-text-secondary hover:text-pb-accent transition-colors duration-200"
              aria-label="GitHub"
            >
              <Icon icon="mdi:github" class="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="text-pb-text-secondary hover:text-pb-accent transition-colors duration-200"
              aria-label="Instagram"
            >
              <Icon icon="skill-icons:instagram" class="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>

        <nav class="mb-6 md:mb-8">
          <ul
            class="flex flex-wrap justify-start items-center gap-x-4 sm:gap-x-6 gap-y-2 text-sm sm:text-base"
          >
            <li>
              <NuxtLink
                to="/faq"
                class="hover:text-pb-accent transition-colors duration-200"
                >Hỏi-Đáp</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/privacy-policy"
                class="hover:text-pb-accent transition-colors duration-200"
                >Chính sách bảo mật</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/terms-of-service"
                class="hover:text-pb-accent transition-colors duration-200"
                >Điều khoản sử dụng</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/about-us"
                class="hover:text-pb-accent transition-colors duration-200"
                >Giới thiệu</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="hover:text-pb-accent transition-colors duration-200"
                >Liên hệ</NuxtLink
              >
            </li>
          </ul>
        </nav>

        <div class="mb-6 md:mb-8">
          <ul
            class="flex flex-wrap justify-start items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm"
          >
            <li>
              <NuxtLink
                to="/dongphim"
                class="text-pb-text-secondary/80 hover:text-pb-accent transition-colors duration-200"
                >Dongphim</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/ghienphim"
                class="text-pb-text-secondary/80 hover:text-pb-accent transition-colors duration-200"
                >Ghienphim</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/motphim"
                class="text-pb-text-secondary/80 hover:text-pb-accent transition-colors duration-200"
                >Motphim</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/subnhanh"
                class="text-pb-text-secondary/80 hover:text-pb-accent transition-colors duration-200"
                >Subnhanh</NuxtLink
              >
            </li>
          </ul>
        </div>

        <div class="text-xs sm:text-sm mb-6 md:mb-8 max-w-3xl">
          <p>
            RoPhim – Phim hay cả rổ - Trang xem phim online chất lượng cao miễn
            phí Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ,
            phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn
            Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ... đa dạng thể loại. Khám
            phá nền tảng phim trực tuyến hay nhất 2024 chất lượng 4K!
          </p>
        </div>

        <div class="text-xs sm:text-sm">
          <p>&copy; {{ new Date().getFullYear() }} RoPhim. All rights reserved.</p>
        </div>
      </div>
      <div class="flex justify-center items-center flex-1">
        <NuxtImg
          src="https://reka-ui.com/logo.svg"
          alt="Logo RoPhim"
          class="h-60"
        />
        <div class="ml-10">
          <span class="text-6xl font-bold text-pb-text"> RoPhim </span>
          <p class="text-3xl text-pb-text-secondary">Phim hay cả rổ</p>
        </div>
      </div>
    </footer>
  </template>

  <script setup lang="ts">
  import { Icon } from "@iconify/vue";
  </script>
