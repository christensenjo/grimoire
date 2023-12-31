<script setup lang="ts">
const showDetails = ref(false);

</script>

<template>
    <div class="flex flex-col max-w-screen-xl px-4 mx-auto text-parchment-100 md:text-fortress dark:text-parchment-100 dark:sm:text-parchment mt-10 lg:mt-0">
        <h5 class="mb-6 text-xl font-bold tracking-tight text-parchment dark:text-fortress w-fit text-center bg-fortress dark:bg-scroll py-2 px-6 rounded-full">
            Featured Location
        </h5>
        <div class="w-fit relative rounded-lg">
            <img src="~/assets/img/featured/Utanou_Village.png" class="h-auto w-full md:max-w-sm lg:max-w-xl rounded-xl" alt="Featured Location Art"/>
            <div 
                class="flex flex-col-reverse pb-8 md:pb-0 bottom-0 md:bottom-8 md:-end-3/4 xl:-end-full absolute z-10 h-full rounded-lg md:backdrop-blur-0"
                :class="showDetails ? 'backdrop-blur-0 transition duration-300 ease-in-out' : 'backdrop-blur-sm transition duration-300 ease-in-out'"
                @click="showDetails = !showDetails"
            >
                <h3 
                    class="text-5xl lg:text-6xl xl:text-8xl font-bold text-parchment-100 md:text-scroll dark:text-parchment text-right pr-2 md:opacity-100"
                    :class="showDetails ? 'opacity-0 transition duration-300 ease-in-out' : 'opacity-100 transition duration-300 ease-in-out'"
                >
                    Utanou Village
                </h3>
                <div class="w-full flex flex-row-reverse">
                    <p 
                        class="text-right w-1/3 text-lg pr-2 pb-4 md:opacity-100"
                        :class="showDetails ? 'opacity-0 transition duration-300 ease-in-out' : 'opacity-100 transition duration-300 ease-in-out'"
                    >
                        The utanouu people eke out their meager existence on the Durganstron cliff-face. Always their concern is primarily on fortifying against the...
                    </p>
                </div>
            </div>
        </div>
        <p
            class="md:hidden text-center mt-1 text-parchment-400 dark:text-fortress-400"
        >
            Click for details
        </p>
    </div>
</template>