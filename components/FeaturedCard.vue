<script setup lang="ts">
const showDetails = ref(false);

</script>

<template>
    <div class="flex flex-col max-w-screen-xl mx-4 xl:mx-auto text-parchment-50 md:text-fortress dark:text-parchment-100 dark:sm:text-parchment mt-10 lg:mt-0">
        <h5 class="mb-2 md:mb-6 text-md md:text-xl font-bold tracking-tight text-parchment dark:text-fortress w-fit text-center bg-fortress dark:bg-scroll py-1 md:py-2 px-6 md:px-6 rounded-full">
            Featured Location
        </h5>
        <div class="w-full relative rounded-lg flex flex-row">
            <img src="~/assets/img/featured/Utanou_Village.png" class="h-auto w-full max-w-xl rounded-xl" alt="Featured Location Art"/>
            <div
                class="flex flex-col justify-end pb-8 md:pb-4 lg:pb-0 bottom-0 absolute z-10 h-full rounded-lg md:backdrop-blur-0 w-full"
                :class="showDetails ? 'backdrop-blur-0 transition duration-300 ease-in-out' : 'backdrop-blur-md transition duration-300 ease-in-out'"
                @click="showDetails = !showDetails"
            >
                <p
                    class="text-right mx-4 md:ml-auto md:px-0 text-md md:text-lg my-2 md:opacity-100 text-ellipsis overflow-y-hidden md:w-1/2"
                    :class="showDetails ? 'opacity-0 transition duration-300 ease-in-out' : 'opacity-100 transition duration-300 ease-in-out'"
                >
                    The utanouu people eke out their meager existence on the Durganstron cliff-face. Always their concern is primarily on fortifying against...The utanouu people eke out their meager existence on the Durganstron cliff-face.
                </p>
                <h3 
                    class="mx-4 md:ml-auto text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-parchment-100 md:text-scroll dark:text-parchment text-right md:opacity-100"
                    :class="showDetails ? 'opacity-0 transition duration-300 ease-in-out' : 'opacity-100 transition duration-300 ease-in-out'"
                >
                    Utanou Village
                </h3>
            </div>
        </div>
        <p
            class="md:hidden text-center mt-1 text-parchment-400 dark:text-fortress-400"
            @click="showDetails = !showDetails"
        >
            Click for details
        </p>
    </div>
</template>