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
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/about', '/contact', '/index', '/library', '/signUp'],
      cookieRedirect: false,
    }
  }
  // tailwindcss: {
  //   cssPath: '~/assets/css/input.css'
  // }
})
