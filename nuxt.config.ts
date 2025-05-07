// https://nuxt.com/docs/api/configuration/nuxt-config
import { mauve, green, grass } from "@radix-ui/colors";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01", // Đảm bảo bạn đã cập nhật ngày này nếu cần
  modules: ["@nuxtjs/tailwindcss", "reka-ui/nuxt", "@nuxt/image"],
  tailwindcss: {
    config: {
      darkMode: 'class',
      content: [
        "./app.vue",
        "./components/**/*.{vue,js,ts,jsx,tsx}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
      ],
      theme: {
        extend: {
          colors: {
            ...mauve,
            ...green,
            ...grass,
            "pb-background": "#17171F",
            "pb-text": "#E5E7EB",
            "pb-text-secondary": "#9CA3AF",
            "pb-surface": "#1F1F29",
            "pb-accent": "#34D399",
            "pb-border": "#2D2D3A",
          },
          keyframes: {
            slideDown: {
              from: { height: "0" },
              to: { height: "var(--reka-accordion-content-height)" },
            },
            slideUp: {
              from: { height: "var(--reka-accordion-content-height)" },
              to: { height: "0" },
            },
            enterFromRight: {
              from: { opacity: "0", transform: "translateX(200px)" },
              to: { opacity: "1", transform: "translateX(0)" },
            },
            enterFromLeft: {
              from: { opacity: "0", transform: "translateX(-200px)" },
              to: { opacity: "1", transform: "translateX(0)" },
            },
            exitToRight: {
              from: { opacity: "1", transform: "translateX(0)" },
              to: { opacity: "0", transform: "translateX(200px)" },
            },
            exitToLeft: {
              from: { opacity: "1", transform: "translateX(0)" },
              to: { opacity: "0", transform: "translateX(-200px)" },
            },
            scaleIn: {
              from: { opacity: "0", transform: "rotateX(-10deg) scale(0.9)" },
              to: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
            },
            scaleOut: {
              from: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
              to: { opacity: "0", transform: "rotateX(-10deg) scale(0.95)" },
            },
            fadeIn: {
              from: { opacity: "0" },
              to: { opacity: "1" },
            },
            fadeOut: {
              from: { opacity: "1" },
              to: { opacity: "0" },
            },
          },
          animation: {
            slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
            slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
            scaleIn: "scaleIn 200ms ease",
            scaleOut: "scaleOut 200ms ease",
            fadeIn: "fadeIn 200ms ease",
            fadeOut: "fadeOut 200ms ease",
            enterFromLeft: "enterFromLeft 250ms ease",
            enterFromRight: "enterFromRight 250ms ease",
            exitToLeft: "exitToLeft 250ms ease",
            exitToRight: "exitToRight 250ms ease",
          },
        },
      },
      plugins: [],
    },
  },
  components: {
    dirs: ["@/components"],
  },
  devtools: { enabled: true },
});
