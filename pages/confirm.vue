<script setup lang="ts">
    const user = useSupabaseUser();

    const cookieName = useRuntimeConfig().public.supabase.cookieName;
    const redirectPath = useCookie(`${cookieName}-redirect-path`).value;

    watch(user, () => {
        if(user.value) {
            console.log(user.value);
            useCookie(`${cookieName}-redirect-path`).value = null;
            return navigateTo(redirectPath || '/content/dashboard');
        }
    }, { immediate: true });
</script>

<template>
    <div>
        <h1>Waiting for login...</h1>
        <p></p>
    </div>
</template>