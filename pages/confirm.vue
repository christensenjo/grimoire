<script setup lang="ts">
    definePageMeta({
        layout: 'focused-form'
    })

    const user = useSupabaseUser();

    const cookieName = useRuntimeConfig().public.supabase.cookieName;
    const redirectPath = useCookie(`${cookieName}-redirect-path`).value;

    watch(user, () => {
        if(user.value) {
            console.log(user.value);
            useCookie(`${cookieName}-redirect-path`).value = null;
            return navigateTo(redirectPath || '/dashboard');
        }
    }, { immediate: true });
</script>

<template>


    <div class="w-full bg-fortress rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-scroll dark:border-scroll-500">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-center text-xl font-bold leading-tight tracking-tight text-parchment md:text-2xl dark:text-fortress">
                Confirm your Email   
            </h1>
            <p class="text-parchment-50 dark:text-tome">
                We have sent a confirmation email to your provided email address. Please check your inbox and click the verification link to activate your account.
            </p>
            <p class="text-parchment-50 dark:text-tome">
                Once verified, you will be automatically logged in and redirected to your dashboard. If you do not see the email, please check your spam folder.
            </p>
            <div class="flex flex-row justify-center items-center mx-auto w-full">
                <NuxtLink to="/">
                    <button 
                        type="button" 
                        class="text-fortress bg-parchment-50 hover:bg-parchment-200 focus:ring-4 focus:ring-fortress-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-scroll dark:hover:bg-scroll-400 focus:outline-none dark:focus:ring-parchment"
                    >
                        Home
                    </button>
                </NuxtLink>
                <NuxtLink to="/login">
                    <button 
                        type="button" 
                        class="text-parchment-50 bg-tome hover:bg-tome-900 focus:ring-4 focus:ring-fortress-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-parchment-50 dark:text-fortress dark:hover:bg-parchment-200 focus:outline-none dark:focus:ring-scroll"
                    >
                        Login
                    </button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>