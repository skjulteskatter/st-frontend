<template>
    <nav class="nav" @click="toggleBurgerMenu">
        <div class="nav__header" @click="$router.push('/')">
            <!-- <img class="nav__header__logo" :src="logo" /> -->
            <h1 style="margin: 0">SongTreasures</h1>
        </div>
        <div class="nav__user-profile" v-if="user">
            <img :src="image" class="nav__user-profile__image" />
            <div class="nav__user-profile__info">
                <div class="nav__user-profile__name">
                    <b>
                        {{ user.displayName }}
                    </b>
                    <base-dropdown
                        class="nav__user-profile__dropdown"
                        icon="fa-angle-down"
                    >
                        <base-button :action="logout" theme="warning">
                            {{ $t("common.logout") }}
                        </base-button>
                    </base-dropdown>
                </div>

                <small class="nav__user-profile__email">{{ user.email }}</small>
            </div>
        </div>
        <div
            class="nav__links"
            :class="{
                'nav__links-active': openBurgerMenu,
                'gap-y': isMobileDevice,
            }"
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
        </div>
    </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OptionsComponent, BaseButton } from "@/components";
import { BaseDropdown } from "@/components/inputs";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        OptionsComponent,
        BaseButton,
        BaseDropdown,
    },
})
export default class TheNavbar extends Vue {
    private userStore = useStore(sessionKey);
    public openBurgerMenu = false;

    public get logo() {
        // Return the direct url to the logo
        return "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo3.jpg";
    }

    public logout() {
        this.userStore.dispatch("logout").then(() => {
            window.location.replace("/login");
        });
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

    public get user() {
        return this.userStore.state.currentUser;
    }

    public get image(): string {
        return this.userStore.getters.image;
    }
}
</script>

<style lang="scss">
.nav {
    background-color: var(--st-background-color);
    border-right: 1px solid var(--st-border-color);

    height: auto;
    max-width: 250px;
    display: flex;
    flex-direction: column;

    &__links {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    &__header {
        padding: var(--st-spacing);
        cursor: pointer;
        border-bottom: 1px solid var(--st-border-color);

        &__logo {
            max-height: 40px;
        }
    }

    &__user-profile {
        padding: var(--st-spacing);
        display: flex;
        align-items: center;
        gap: var(--st-spacing);
        justify-self: flex-end;
        background-color: var(--st-secondary-background-color);

        &__info {
            display: flex;
            flex-direction: column;
        }

        &__name {
            display: flex;
            gap: calc(var(--st-spacing) * 0.5);
        }

        &__email {
            opacity: 0.5;
        }

        &__image {
            --st-pfp-size: 40px;
            border-radius: 100%;
            max-width: var(--st-pfp-size);
            max-height: var(--st-pfp-size);
            width: 100%;
            height: 100%;
        }
    }

    &__settings {
        justify-self: flex-start;
    }

    &__item {
        color: var(--st-text-color);
        padding: var(--st-spacing);
        text-decoration: none;
        transition: border-left 0.2s;

        &.router-link-exact-active {
            color: var(--st-primary-color);
            position: relative;
            border-left: 5px solid var(--st-primary-color);

            // &:after {
            //     content: "";
            //     background-color: var(--st-primary-color);
            //     position: absolute;
            //     top: 100%;
            //     left: 0;
            //     height: 2px;
            //     width: 100%;
            //     animation: growFromLeft 0.3s ease;
            // }
        }
    }
}
</style>