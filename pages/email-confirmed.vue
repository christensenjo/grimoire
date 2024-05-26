<template>
  <div class="w-full bg-fortress rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-scroll dark:border-scroll-500">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 class="text-xl font-bold leading-tight tracking-tight text-parchment md:text-2xl dark:text-fortress">
        Email Confirmed
      </h1>
      <p class="text-tome-500 dark:text-tome">
        Your email has been successfully confirmed. To continue you may return to the tab you signed up on, or login from here.
      </p>
      <div class="flex justify-center mt-4">
        <NuxtLink to="/" class="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg">Home</NuxtLink>
        <NuxtLink to="/login" class="px-4 py-2 ml-4 text-white bg-primary-600 hover:bg-primary-700 rounded-lg">Login</NuxtLink>
      </div>
    </div>
  </div>
</template>
