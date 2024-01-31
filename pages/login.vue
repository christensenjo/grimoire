<script setup lang="ts">
    const supabase = useSupabaseClient()
    const email = ref('')
    const password = ref('')

    const signUp = async () => {
        const { user, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });

        console.log(user);

        if (error) console.log(error);
    };

    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });

        if (error) console.log(error);
    };

    // const signInWithOAuth = async (thisProvider: string) => {
    //     const { data, error } = await supabase.auth.signInWithOAuth({ 
    //         provider: thisProvider,
    //         options: {
    //             redirectTo: 'https://localhost:3000/confirm',
    //         }
    //     }); 
    // };
</script>

<template>
    <div class="flex flex-col items-center gap-3">
        <h1 class="dark:text-parchment-50 text-xl">Sign Up Here...</h1>
        <input
            placeholder="Email"
            class="rounded-lg"
            v-model="email"
            type="email"
        />
        <input
            placeholder="Password"
            class="rounded-lg"
            v-model="password"
            type="password"
        />
        <button @click="signUp" class="dark:text-parchment-50">
            Sign Up
        </button>
    </div>
</template>
