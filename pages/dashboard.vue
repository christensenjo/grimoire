<script setup>
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const userName = computed(() => userStore.user?.user_metadata?.full_name || 'User');

</script>

<template>
    <div class="flex flex-col justify-center items-center mx-auto">
        <h1>Dashboard</h1>
        <p>Welcome {{ userName }}</p>
    </div>
</template>