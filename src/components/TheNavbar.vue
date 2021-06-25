<template>
    <nav class="z-10 bg-white sm:w-16 md:w-full shadow-md md:max-w-xs flex justify-between sm:justify-start sm:flex-col sticky top-0 left-0 dark:bg-secondary">
        <nav-logo />
        <div class="p-4 hidden md:block">
            <full-search-input :disabled="$route.name == 'search'" />
        </div>
        <nav-links />
        <playlist-list />
        <!-- <user-profile class="hidden md:flex" /> -->
    </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { FullSearchInput } from "@/components/inputs";
import { PlaylistList, UserProfile, NavLinks, NavLogo } from "@/components/nav";

@Options({
    components: {
        PlaylistList,
        FullSearchInput,
        UserProfile,
        NavLinks,
        NavLogo,
    },
    name: "the-navbar",
})
export default class TheNavbar extends Vue {}
</script>
