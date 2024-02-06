<template>
    <div class="bg-parchment dark:bg-fortress h-screen w-full m-0 p-0 flex flex-col justify-center items-center align-middle">
        <section class="bg-parchment dark:bg-fortress">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <NuxtLink to="/" class="flex items-center mb-6 text-2xl font-semibold text-fortress dark:text-scroll">
                    <img src="~/assets/img/logo/grimoire_logo_tome.svg" class="mr-3 h-6 sm:h-9" alt="Logo" />
                    Grimoire
                </NuxtLink>
                <slot class="" />
            </div>
        </section>
    </div>
</template>