<template>
    <nav class="z-10 bg-white shadow-md md:max-w-xs flex sm:flex-col flex-shrink-0 sticky top-0 left-0">
        <nav-logo />
        <div class="p-4 hidden md:block">
            <FullSearchInput />
        </div>
        <nav-links />
        <playlist-list />
        <user-profile class="hidden md:flex" />
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
