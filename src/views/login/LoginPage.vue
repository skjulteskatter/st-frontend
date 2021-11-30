<template>
    <div class="h-screen w-screen grid lg:grid-cols-2" v-if="initialized && !user">
        <router-view />
        <section class="hidden lg:flex lg:flex-col lg:items-center bg-secondary pattern">
            <div class="w-full h-full max-w-xl flex flex-col justify-center">
                <h1 class="font-bold text-white text-5xl mb-4 leading-tight">Welcome to<wbr> SongTreasures</h1>
                <p class="text-lg tracking-wide text-white/50">Sign in or register an account to get access to hundreds of spiritual songs and melodies.</p>
            </div>
        </section>
    </div>
    <Loader v-else :loading="true"></Loader>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/store";

export default defineComponent({
    name: "login-page",
    data: () => ({
        store: useStore(),
    }),
    computed: {
        user() {
            return this.store.getters.user;
        },
        initialized() {
            return this.store.getters.initialized;
        },
    },
    mounted() {
        if (this.user) {
            this.$router.push({ name: "main" });
        }
    },
});
</script>

<style lang="scss">
.pattern {
    background-image: url("/img/login-bg.svg");
}
</style>
