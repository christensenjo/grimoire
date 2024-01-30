<script setup>
    // PROPS
    const props = defineProps({
        title: String,
    });


    // DATA
    const darkToggleState = ref(null); // Manage dark mode toggle focus state

    // METHODS
    const colorMode = useColorMode();
    const toggleDarkMode = () => {
        if(colorMode.value === 'light') {
            colorMode.value = 'dark';
        } else {
            colorMode.value = 'light';
        }

        if(darkToggleState.value) {
            darkToggleState.value.blur(); // Remove focus from the button after clicking
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
                        ref="darkToggleState"
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
                    <button
                        data-drawer-target="drawer-navigation"
                        data-drawer-show="drawer-navigation"
                        data-drawer-backdrop="true"
                        type="button"
                        class="inline-flex items-center p-2 ml-1 text-sm bg-scroll text-fortress rounded-lg lg:hidden hover:bg-parchment-100 focus:outline-none focus:ring-2 focus:ring-parchment-100 dark:text-fortress dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="drawer-navigation"
                        aria-expanded="false"
                    >
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
            <!-- Mobile Side Navigation Drawer -->
            <div id="drawer-navigation" class="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-parchment-50 w-64 dark:bg-fortress-950" tabindex="-1" aria-labelledby="drawer-navigation-label">
                <h5 id="drawer-navigation-label" class="text-base font-semibold text-primary uppercase dark:text-parchment">Grimoire    </h5>
                <button 
                    id="drawer-hide-button"
                    type="button"
                    data-drawer-hide="drawer-navigation" 
                    aria-controls="drawer-navigation" 
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close menu</span>
                </button>
                <div class="py-4 overflow-y-auto">
                    <ul class="space-y-2 font-medium">
                        <li>
                            <NuxtLink to="/" data-drawer-hide="drawer-navigation" class="flex items-center p-2 text-fortress rounded-lg dark:text-parchment-100 hover:bg-fortress-700 dark:hover:bg-fortress group">
                                <Icon name="i-material-symbols-home-rounded" size="1.3em" class="text-fortress dark:text-gray-400" />
                                <span class="ms-3">Home</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/library" 
                    data-drawer-hide="drawer-navigation" class="flex items-center p-2 text-fortress rounded-lg dark:text-parchment-100 hover:bg-fortress-700 dark:hover:bg-fortress group" aria-current="page">
                                <Icon name="i-fluent-library-20-filled" size="1.3em" class="text-fortress dark:text-gray-400" />
                                <span class="ms-3">Library</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/about" data-drawer-hide="drawer-navigation" class="flex items-center p-2 text-fortress rounded-lg dark:text-parchment-100 hover:bg-fortress-700 dark:hover:bg-fortress group" aria-current="page">
                                <Icon name="i-mdi-information-variant-circle" size="1.3em" class="text-fortress dark:text-gray-400" />
                                <span class="ms-3">About Us</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/contact" data-drawer-hide="drawer-navigation" class="flex items-center p-2 text-fortress rounded-lg dark:text-parchment-100 hover:bg-fortress-700 dark:hover:bg-fortress group" aria-current="page">
                                <Icon name="i-ic-round-email" size="1.3em" class="text-fortress dark:text-gray-400" />
                                <span class="ms-3">Contact</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="" data-drawer-hide="drawer-navigation" class="flex items-center p-2 text-fortress rounded-lg dark:text-parchment-100 hover:bg-fortress-700 dark:hover:bg-fortress group" aria-current="page">
                                <Icon name="i-ph-sign-in-bold" size="1.3em" class="text-fortress dark:text-gray-400" />
                                <span class="ms-3">Log In</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="" data-drawer-hide="drawer-navigation" class="flex items-center p-2 text-parchment rounded-lg dark:text-parchment-100 bg-fortress-700 hover:bg-fortress dark:bg-tome dark:hover:bg-scroll-700 group" aria-current="page">
                                <svg class="flex-shrink-0 w-5 h-5 text-scroll transition duration-75 dark:text-gray-400 group-hover:text-parchment dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
                                </svg>
                                <span class="ms-3">Get Started</span>
                            </NuxtLink>
                        </li>
                        <!-- <li>
                            <button 
                                ref="darkToggleState"
                                type=""
                                class="flex items-center p-2 text-fortress rounded-lg dark:text-parchment-100 hover:bg-fortress-700 dark:hover:bg-fortress group"
                                @click="toggleDarkMode()"
                            >
                                <Icon name="i-heroicons-moon-20-solid" size="1.3em" />
                                <span class="ms-3">Toggle Dark Mode</span>
                            </button>
                        </li> -->
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>