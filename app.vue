<script setup>
useHead({
  title: 'Grimoire',
  meta: [
    { name: 'description', content: 'A universal worldbuilding tool.' }
  ],
  bodyAttrs: {
    class: ''
  },
  script: [ { 
    // innerHTML: 'console.log(\'Hello world\')' 
  } ]
})

const colorMode = useColorMode();
</script>

<template>
  <div class="bg-parchment-50 dark:bg-fortress h-screen w-screen mx-0 px-0">
    <NavBar
      title="Grimoire"
    />
    <NuxtPage />
    <Footer />
  </div>
</template>
