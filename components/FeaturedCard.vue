<template>
    <!-- class="grid max-w-screen-xl px-4 pt-8 pb-2 mx-auto lg:gap-8 xl:gap-0 lg:pt-16 lg:pb-0 lg:grid-cols-12" -->
    <div class="flex flex-col max-w-screen-xl mx-auto text-fortress dark:text-parchment">
        <h5 class="mb-6 text-xl font-bold tracking-tight text-parchment dark:text-fortress w-fit text-center bg-fortress dark:bg-scroll py-2 px-6 rounded-full">
            Featured Location
        </h5>
        <!-- transition-all duration-300 blur-sm hover:blur-none -->
        <div class="w-fit relative">
            <img src="~/assets/img/featured/Utanou_Village.png" class="h-auto max-w-xl rounded-xl" alt="Featured Location Art"/>
            <div class="flex flex-col-reverse bottom-8 -end-full absolute z-10 ">
                <h3 class="text-8xl font-bold text-scroll dark:text-parchment text-right">Utanou Village</h3>
                <div class="w-full flex flex-row-reverse">
                    <p class="text-right w-1/2 text-lg">The utanouu people eek out their meager existence on the Durganstron cliff-face. Always their concern is primarily on fortifying against the...</p>
                </div>
            </div>
        </div>
    </div>
</template>