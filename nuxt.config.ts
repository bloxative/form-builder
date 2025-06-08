import tailwindcss from '@tailwindcss/vite';
import { createResolver } from 'nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  components: {
    dirs: [
      {
        path: 'components',
        pathPrefix: false
      }
    ]
  },

  vite: {
    plugins: [tailwindcss()]
  },

  css: [resolve('./assets/css/main.css')]
});
