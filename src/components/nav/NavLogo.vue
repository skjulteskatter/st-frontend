<template>
    <button class="p-4 cursor-pointer max-h-16 md:max-h-20 focus:outline-none focus:ring focus:ring-primary rounded" @click="$router.push('/')">
        <img
            class="max-h-full m-0 hidden md:dark:block"
            alt="logo"
            :src="`/img/logo/light.svg`"
        />
        <img
            class="max-h-full m-0 hidden md:block dark:hidden"
            alt="logo"
            :src="`/img/logo/dark.svg`"
        />
        <img
            src="/img/logo/icon.svg"
            alt="logo"
            class="max-h-full m-0 md:hidden"
        />
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "nav-logo",
})
export default class NavLogo extends Vue {}
</script>
