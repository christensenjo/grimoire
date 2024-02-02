<script setup>
import { onMounted } from 'vue';
import { initDrawers } from 'flowbite';

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

// initialize components based on data attribute selectors
onMounted(() => {
    initDrawers();
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
