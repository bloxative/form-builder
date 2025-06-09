import defu from 'defu';
import tailwindcss from '@tailwindcss/vite';
import { createResolver } from 'nuxt/kit';

const { resolve } = createResolver(import.meta.url);

/**
 * Modules
 */
const modules = defineNuxtConfig({
  modules: ['@nuxt/ui', '@vee-validate/nuxt'],

  ui: {
    fonts: false,
    colorMode: false
  }
});

/**
 * Build
 */
const build = defineNuxtConfig({
  app: {
    baseURL: '/form-builder/',
    buildAssetsDir: 'assets/'
  },

  nitro: {
    preset: 'github-pages'
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
      },
      title: 'Form Builder'
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

export default defu(modules, build, app);
