// https://nuxt.com/docs/api/configuration/nuxt-config
 import { mauve, green, grass } from '@radix-ui/colors';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/tailwindcss','reka-ui/nuxt',
  ],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            ...mauve,
            ...green,
            ...grass,
          },
          keyframes: {
            slideDown: {
              from: { height: "0" },
              to: { height: 'var(--reka-accordion-content-height)' },
            },
            slideUp: {
              from: { height: 'var(--reka-accordion-content-height)' },
              to: { height: "0" },
            },
          },
          animation: {
            slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
            slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
          },
        },
      },  
      plugins: [],
    }
  },
  devtools: { enabled: true }
})
