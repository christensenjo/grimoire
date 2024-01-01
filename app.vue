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
  <div class="bg-parchment-50 dark:bg-fortress h-screen w-full mx-0 px-0 flex flex-col justify-between">
    <NavBar
      title="Grimoire"
    />
    <NuxtPage />
    <Footer />
  </div>
</template>
