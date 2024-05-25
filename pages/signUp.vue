<script setup lang="ts">
    import { useUserStore } from '~/stores/user';
    
    definePageMeta({
        layout: 'focused-form'
    })
    
    const userStore = useUserStore();
    const supabase = useSupabaseClient()
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const signUp = async (event: { preventDefault: () => void; }) => {
        event?.preventDefault();

        if(password.value !== confirmPassword.value) return console.log('Passwords do not match');

        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });

        if (error) {
            console.log(error);
        } else {
            userStore.setUser(data?.user);
            console.log('User account created, signed in, and data saved to user store');
            navigateTo('/confirm'); // Redirect to the confirm page
        }
    };
</script>

<template>
    <div class="w-full bg-fortress rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-scroll dark:border-scroll-500">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-parchment md:text-2xl dark:text-fortress">
                Create an account
            </h1>
            <form class="space-y-4 md:space-y-6" action="#">
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-parchment dark:text-fortress">Your email</label>
                    <input v-model="email" type="email" name="email" id="email" class="bg-parchment-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-fortress-900 dark:focus:border-blue-500" placeholder="name@company.com" required="true">
                </div>
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-parchment dark:text-fortress">Password</label>
                    <input v-model="password" type="password" name="password" id="password" placeholder="••••••••" class="bg-parchment-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-parchment-50 dark:focus:ring-fortress-900 dark:focus:border-blue-500" required="true">
                </div>
                <div>
                    <label for="confirm-password" class="block mb-2 text-sm font-medium text-parchment dark:text-fortress">Confirm password</label>
                    <input v-model="confirmPassword" type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-parchment-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-parchment-50 dark:focus:ring-fortress-900 dark:focus:border-blue-500" required="true">
                </div>
                <div class="flex items-start">
                    <div class="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blood-800 dark:ring-offset-blood text-blood" required="false">
                    </div>
                    <div class="ml-3 text-sm">
                        <label for="terms" class="text-tome-500 dark:text-tome">I accept the <a href="#" class="font-medium text-parchment-300 hover:underline dark:text-scroll-900">Terms and Conditions</a></label>
                    </div>
                </div>
                <button @click="signUp" type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                <p class="text-sm font-light text-tome-500 dark:text-tome-900">
                    Already have an account? <NuxtLink to="/login" class="font-medium text-parchment-300 hover:underline dark:text-tome-900">Login here</NuxtLink>
                </p>
            </form>
        </div>
    </div>
</template>
