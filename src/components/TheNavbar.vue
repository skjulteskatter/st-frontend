<template>
    <nav class="nav" @click="toggleBurgerMenu">
        <div class="container nav__wrapper">
            <img class="nav__logo" :src="logo" @click="$router.push('/')" />
            <base-button
                theme="secondary"
                v-if="isMobileDevice"
                label="Menu"
            ></base-button>
            <div
                class="nav__links gap-x"
                :class="{ 'nav__links-active': openBurgerMenu }"
            >
                <router-link class="nav__item" :to="{ name: 'main' }">{{
                    $t("common.dashboard")
                }}</router-link>
                <router-link class="nav__item" :to="{ name: 'collections' }">{{
                    $t("common.songs")
                }}</router-link>
                <router-link class="nav__item" :to="{ name: 'store' }">{{
                    $t("common.store")
                }}</router-link>
                <router-link
                    v-if="isAdmin"
                    class="nav__item"
                    :to="{ name: 'admin' }"
                    >Admin</router-link
                >
                <options-component
                    class="nav__item settings"
                ></options-component>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import OptionsComponent from "@/components/OptionsComponent.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        OptionsComponent,
        BaseButton,
    },
})
export default class TheNavbar extends Vue {
    public openBurgerMenu = false;

    public get logo() {
        // Return the direct url to the logo
        return "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo3.jpg";
    }

    public toggleBurgerMenu() {
        this.openBurgerMenu = !this.openBurgerMenu;
    }

    public get isAdmin() {
        return useStore(sessionKey).getters.isAdmin;
    }

    public get isMobileDevice() {
        return window.orientation != undefined;
    }
}
</script>

<style lang="scss" scoped>
.nav {
    background-color: var(--st-background-color);
    border-bottom: 1px solid var(--st-border-color);

    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 10;

    &__wrapper {
        display: flex;
        justify-content: space-between;
    }

    &__links {
        display: flex;
        align-items: center;
        // gap: var(--st-spacing);
    }

    &__logo {
        max-height: 35px;
        cursor: pointer;
    }

    &__item {
        color: var(--st-text-color);
        text-decoration: none;

        &.router-link-exact-active {
            color: var(--st-primary-color);
            position: relative;

            &:after {
                content: "";
                background-color: var(--st-primary-color);
                position: absolute;
                top: 100%;
                left: 0;
                height: 2px;
                width: 100%;
                animation: growFromLeft 0.3s ease;
            }
        }
    }

    @media screen and (max-width: 600px) {
        .nav__links {
            padding: var(--st-spacing);
            background-color: var(--st-background-color);
            border-left: 1px solid var(--st-border-color);
            flex-direction: column;
            position: fixed;
            height: 100%;
            top: 0;
            right: -100%;
            transition: all 0.5s ease;

            &-active {
                right: 0;
            }

            .settings {
                margin-top: auto;
            }
        }
    }
}
</style>