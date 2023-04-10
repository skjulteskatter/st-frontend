<template>
    <div class="w-full h-screen text-center p-4 flex flex-col justify-center items-center">
        <h1 class="text-6xl text-primary mb-8">404</h1>
        <div class="flex flex-col gap-4">
            <h2 class="font-bold text-xl">Sorry, this page does not exist.</h2>
            <router-link class="text-md bg-secondary text-white py-2 px-3 rounded-md" to="/">Go to dashboard</router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "not-found",
});
</script>
