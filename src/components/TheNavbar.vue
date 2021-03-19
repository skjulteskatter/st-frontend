<template>
    <nav class="nav">
        <div class="nav__header" @click="$router.push('/')">
            <img
                class="nav__header__logo"
                alt="logo"
                src="/img/SongTreasures_logo.svg"
            />
            <img
                src="/img/SongTreasures_logo_icon.svg"
                alt="logo"
                class="nav__header__logo--icon"
            />
        </div>
        <div class="nav__search">
            <FullSearchInput />
        </div>
        <nav-links />
        <collection-list />
        <user-profile class="nav__user-profile" />
    </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";
import { FullSearchInput } from "@/components/inputs";
import { CollectionList, UserProfile, NavLinks } from "@/components/nav";

@Options({
    components: {
        Icon,
        CollectionList,
        FullSearchInput,
        UserProfile,
        NavLinks,
    },
})
export default class TheNavbar extends Vue {}
</script>

<style lang="scss">
@import "../style/mixins";

.nav {
    --size: 40px;
    background-color: var(--st-color-background-light);
    border-right: 1px solid var(--st-color-border);

    height: auto;
    max-width: 250px;
    width: 100%;

    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    z-index: 9999;

    @include breakpoint("small") {
        flex-direction: initial;
        max-width: none;
        border-bottom: 1px solid var(--st-color-border);
        position: sticky;
        top: 0;
        left: 0;
        height: min-content;

        .nav__header {
            border-bottom: none;
        }
    }

    @include breakpoint("medium") {
        width: auto;

        .nav__header__logo--icon {
            display: block;
            height: calc(var(--size) * 0.75);
        }

        .nav__header__logo {
            display: none;
        }

        .nav__user-profile {
            display: none;
        }

        .nav__settings {
            display: flex !important;
        }

        .nav__search-link {
            display: flex !important;
        }
    }

    &__settings {
        display: none !important;
    }

    &__search-link {
        display: none !important;
    }

    &__search {
        padding: var(--st-spacing);

        @include breakpoint("medium") {
            display: none;
        }

        input {
            background-color: rgba(white, 0.1) !important;
        }
    }

    &__header {
        padding: var(--st-spacing);
        cursor: pointer;

        &__logo {
            max-height: var(--size);
            margin: 0;
        }

        &__logo--icon {
            display: none;
        }
    }
}
</style>