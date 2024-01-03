<template>
    <section class="bg-parchment-50 dark:bg-fortress pb-32">
        <div class="grid max-w-screen-xl px-4 pt-8 pb-2 mx-auto lg:gap-8 xl:gap-0 lg:pt-16 lg:pb-0 lg:grid-cols-12 mb-24">
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
        <div class="w-fit max-w-screen-xl mx-4 lg:mx-auto text-center flex-col gap-3">
            <h2 class="text-5xl font-bold text-fortress dark:text-parchment mb-6">A universal worldbuilding tool</h2>
            <p class="text-2xl text-fortress-600 dark:text-parchment mb-8">Create unique settings, locations, and characters. Manage all your fantasy assets in a single modern application.</p>
            <div class="flex flex-wrap gap-4 justify-center">
                <Card 
                    title="An Arcane Armory"
                    description="Manage all of your worldbuilding assets from a single thematic tool. Organize your settings with locations, characters, and more."
                    icon="i-mdi-treasure-chest"
                />
                <Card 
                    title="Build Legends"
                    description="Craft heroes, villains, or simple townsfolk. Use mechanically flexible and narrative rich tools."
                    icon="i-clarity-users-solid"
                />
                <Card 
                    title="Tome Trading"
                    description="Browse the Grimoires of fellow creators and summon their shared assets to your aid."
                    icon="i-material-symbols-book-2"
                    disclaimer="*Coming Soon*"
                />
                <Card 
                    title="Scribe's Choice"
                    description="Dive deep into manual creation or let the currents of inspiration guide your hand through artificial intelligence."
                    icon="i-fa6-solid-pen-nib"
                    disclaimer="*Coming Soon*"
                />
                <Card 
                    title="Dynamic Dialogue"
                    description="Engage with your created characters through the magic of AI and unearth their stories."
                    icon="i-majesticons-messages"
                    disclaimer="*Coming Soon*"
                />
                <Card 
                    title="Sorcerer's Studio"
                    description="Craft immersive settings with presentation tools for artist attributed or AI generated fantasy art."
                    icon="i-fa6-solid-palette"
                    disclaimer="*Coming Soon*"
                />
            </div>
        </div>
    
        <div class="w-full mb-32">
            <FeaturedCard />
            <FeaturedCard />
            <FeaturedCard />
        </div>
    </section>
</template>
