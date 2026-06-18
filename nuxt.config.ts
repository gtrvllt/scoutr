// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css',
    'mapbox-gl/dist/mapbox-gl.css',
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  devServer: {
    port: 4000,
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN || '',
    },
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  modules: ['@nuxt/ui', '@nuxt/icon', '@pinia/nuxt', 'motion-v/nuxt'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: null,
  },
})