<script setup>
    const props = defineProps({
        title: String,
    });

    const colorMode = useColorMode();

    const toggleDarkMode = () => {
        if(colorMode.value === 'light') {
            colorMode.value = 'dark';
        } else {
            colorMode.value = 'light';
        }
    };
</script>

<template>
    <header>
        <nav class="bg-fortress border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-scroll text-parchment">
            <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <!-- Logo and Title -->
                <NuxtLink to="/" class="flex items-center">
                    <img src="~/assets/img/logo/grimoire_logo_tome.svg" class="mr-3 h-6 sm:h-9" alt="Logo" />
                    <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-fortress">{{ title }}</span>
                </NuxtLink>
                <!-- Actions -->
                <div class="flex items-center lg:order-2">
                    <!-- Theme Switcher -->
                    <button 
                        type=""
                        class="hidden sm:inline p-2 mr-2 text-sm font-medium text-scroll focus:outline-none bg-fortress rounded-full border border-scroll hover:bg-scroll hover:text-fortress focus:z-10 focus:ring-4 focus:ring-parchment-200 dark:focus:ring-gray-700 dark:bg-scroll dark:text-fortress dark:border-gray-600 dark:hover:text-scroll dark:hover:bg-fortress"
                        @click="toggleDarkMode()"
                    >
                        <Icon name="i-heroicons-moon-20-solid" size="1.3em" />
                    </button>
                    <!-- Log In -->
                    <NuxtLink to="/" class="hidden sm:inline text-parchment dark:text-fortress hover:bg-parchment-100 hover:text-fortress focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-fortress dark:hover:text-scroll focus:outline-none dark:focus:ring-fortress-800">Log In</NuxtLink>
                    <!-- Get Started -->
                    <NuxtLink to="/" class="text-parchment bg-tome hover:bg-tome-600 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-fortress-700 dark:hover:bg-primary-900 focus:outline-none dark:focus:ring-primary-800">Get Started</NuxtLink>
                    <!-- Mobile Hamburger Menu -->
                    <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-fortress rounded-lg lg:hidden hover:bg-parchment-100 focus:outline-none focus:ring-2 focus:ring-parchment-100 dark:text-fortress dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                        <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
                <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                    <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                        <li>
                            <NuxtLink to="/library" class="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-parchment lg:p-0 dark:text-fortress" aria-current="page">Library</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/about" class="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-parchment lg:p-0 dark:text-fortress" aria-current="page">About Us</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/contact" class="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-parchment lg:p-0 dark:text-fortress" aria-current="page">Contact</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>