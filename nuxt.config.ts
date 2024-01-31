// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@nuxtjs/supabase'
  ],
  colorMode: {
    classSuffix: ''
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['about', 'contact', 'index', 'library'],
      cookieRedirect: false,
    }
  }
  // tailwindcss: {
  //   cssPath: '~/assets/css/input.css'
  // }
})
