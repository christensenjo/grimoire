<template>
    <section class="bg-parchment-50 dark:bg-fortress pb-32">
        <div class="grid max-w-screen-xl px-4 pt-8 pb-2 mx-auto lg:gap-8 xl:gap-0 lg:pt-16 lg:pb-0 lg:grid-cols-12">
            <div class="mr-auto place-self-center lg:col-span-7">
                <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-fortress dark:text-parchment">What lore lies within the pages of your Grimoire?</h1>
                <p class="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl text-fortress-600 dark:text-gray-400">Use a universal worldbuilding tool to elevate your storytelling. Tailored for the imaginative mind.</p>
                <a href="#" class="inline-flex items-center justify-center px-4 lg:px-5 py-3 mr-3 text-base font-medium text-parchment text-center bg-tome hover:bg-tome-600 rounded-lg focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 focus:outline-none">
                    Get Started
                    <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </a>
                <a href="#" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-tome dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                    Log In
                </a>
            </div>
            <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
                <img src="~/assets/img/hero/hero_sparkle_tome.svg" alt="Open Grimoire">
            </div>
        </div>
        <div class="w-full">
            <FeaturedCard />
        </div>
    </section>
</template>
