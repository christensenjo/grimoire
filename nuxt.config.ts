// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@nuxtjs/supabase',
    '@pinia/nuxt'
  ],
  colorMode: {
    classSuffix: ''
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/about', '/contact', '/', '/library', '/signUp', '/email-confirmed', '/confirm'],
      cookieRedirect: true,
    }
  },
  // tailwindcss: {
  //   cssPath: '~/assets/css/input.css'
  // }
})
