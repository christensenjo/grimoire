<script setup>
    const props = defineProps({
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: false,
        },
        image_path: {
            type: String,
            required: false,
        },
        showLink: {
            type: Boolean,
            required: false,
            default: true,
        },
        link: {
            type: String,
            required: false,
            default: '',
        },
        linkText: {
            type: String,
            required: false,
        },
        disclaimer: {
            type: String,
            required: false,
        },
    });
</script>

<template>
    <div class="max-w-sm p-6 bg-parchment-100 border border-gray-200 rounded-lg shadow dark:bg-tome dark:border-gray-700 flex flex-col items-center">
        <Icon v-if="icon" :name="icon" class="w-10 h-10 text-scroll dark:text-parchment" />
        <img v-if="image_path" :src="'/img/' + image_path" class="w-10 h-8 fill-scroll dark:fill-red" />
        <NuxtLink to="" class="flex flex-row gap-2 items-center">
            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-fortress dark:text-parchment-50">{{ title }}</h5>
            <p class="text-scroll text-xs">{{ disclaimer }}</p>
        </NuxtLink>
        <p class="mb-3 font-normal text-gray-500 dark:text-parchment">{{ description }}</p>
        <NuxtLink v-if="linkText" :to="link" class="inline-flex items-center text-blue-600 hover:underline">
            {{ linkText }}
            <svg class="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
            </svg>
        </NuxtLink>
    </div>
</template>