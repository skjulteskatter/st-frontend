<template>
    <div class="p-4 cursor-pointer max-h-16 md:max-h-20 h-full" @click="$router.push('/')">
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
            class="m-0 max-h-10 md:hidden"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "nav-logo",
})
export default class NavLogo extends Vue {}
</script>
