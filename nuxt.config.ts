import defu from 'defu';
import tailwindcss from '@tailwindcss/vite';
import { createResolver } from 'nuxt/kit';

const { resolve } = createResolver(import.meta.url);

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Modules
 */
const modules = defineNuxtConfig({
  modules: ['@nuxt/ui', '@vee-validate/nuxt', 'vue-sonner/nuxt'],

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
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: 'favicon.ico'
        }
      ]
    }
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

export default defu(modules, isProduction && build, app);
