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
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/about', '/contact', '/', '/library', '/signUp'],
      cookieRedirect: true,
    }
  }
  // tailwindcss: {
  //   cssPath: '~/assets/css/input.css'
  // }
})
