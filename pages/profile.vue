<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
    layout: 'default'
})

const userStore = useUserStore();
const user = useSupabaseUser();
const client = useSupabaseClient();

const displayName = ref('');
const profilePicture = ref<File | null>(null);
const isUpdating = ref(false);
const updateMessage = ref('');

// Initialize display name with current value or email
onMounted(() => {
    displayName.value = user.value?.user_metadata?.display_name || user.value?.email || '';
});

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        profilePicture.value = target.files[0];
    }
};

const updateProfile = async () => {
    isUpdating.value = true;
    updateMessage.value = '';

    try {
        let avatarUrl = user.value?.user_metadata?.avatar_url;

        // Upload new profile picture if selected
        if (profilePicture.value) {
            const fileExt = profilePicture.value.name.split('.').pop();
            const fileName = `${user.value?.id}-${Math.random()}.${fileExt}`;

            const { data, error } = await client.storage
                .from('profile-pictures')
                .upload(fileName, profilePicture.value);

            if (error) throw error;

            const { data: { publicUrl } } = client.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);

            avatarUrl = publicUrl;
        }

        // Update user metadata
        const { data, error } = await client.auth.updateUser({
            data: { 
                display_name: displayName.value,
                avatar_url: avatarUrl
            }
        });

        if (error) throw error;

        // Update local user store
        userStore.setUser(data.user);
        updateMessage.value = 'Profile updated successfully!';
    } catch (error) {
        console.error('Error updating profile:', error);
        updateMessage.value = 'Failed to update profile. Please try again.';
    } finally {
        isUpdating.value = false;
    }
};
</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">User Profile</h1>
        <div v-if="user" class="bg-fortress text-parchment p-6 rounded-lg shadow-md">
            <div class="mb-4">
                <strong>Email:</strong> {{ user.email }}
            </div>
            <div class="mb-4">
                <strong>Display Name:</strong>
                <input v-model="displayName" type="text" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-fortress" />
            </div>
            <div class="mb-4">
                <strong>Profile Picture:</strong>
                <img v-if="user.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" alt="Profile Picture" class="w-20 h-20 rounded-full mb-2">
                <input type="file" @change="handleFileUpload" accept="image/jpeg, image/png" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
            </div>
            <button @click="updateProfile" :disabled="isUpdating" class="bg-blood text-parchment px-4 py-2 rounded hover:bg-blood-700 transition-colors disabled:opacity-50">
                {{ isUpdating ? 'Updating...' : 'Update Profile' }}
            </button>
            <p v-if="updateMessage" class="mt-2 text-sm" :class="{ 'text-green-500': updateMessage.includes('success'), 'text-red-500': updateMessage.includes('Failed') }">
                {{ updateMessage }}
            </p>
        </div>
        <div v-else class="text-tome">
            Loading user data...
        </div>
    </div>
</template>
