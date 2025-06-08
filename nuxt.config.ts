import defu from 'defu';
import tailwindcss from '@tailwindcss/vite';
import { createResolver } from 'nuxt/kit';

const { resolve } = createResolver(import.meta.url);

/**
 * Modules
 */
const modules = defineNuxtConfig({
  modules: ['@nuxt/ui'],

  ui: {
    fonts: false,
    colorMode: false
  }
});

/**
 * App
 */
const app = defineNuxtConfig({
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

export default defu(modules, app);
