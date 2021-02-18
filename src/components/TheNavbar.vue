<template>
    <nav class="nav" @click="toggleBurgerMenu">
        <div class="nav__header" @click="$router.push('/')">
            <img
                class="nav__header__logo"
                alt="logo"
                src="/img/SongTreasures_logo_v2.svg"
            />
            <img
                src="/img/SongTreasures_logo_v2_icon.svg"
                alt="logo"
                class="nav__header__logo--icon"
            />
        </div>
        <div class="nav__user-profile" v-if="user">
            <img :src="image" class="nav__user-profile__image" />
            <div class="nav__user-profile__info">
                <div class="nav__user-profile__name">
                    <b>
                        {{ user.displayName }}
                    </b>
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
            <router-link class="nav__item" :to="{ name: 'main' }">
                <icon name="home" size="20" />
                <span>{{ $t("common.dashboard") }}</span>
            </router-link>
            <router-link class="nav__item" :to="{ name: 'collections' }">
                <icon name="book" size="20" />
                <span>{{ $t("common.songs") }}</span>
            </router-link>
            <router-link class="nav__item" :to="{ name: 'store' }">
                <icon name="shop" size="20" />
                <span>{{ $t("common.store") }}</span>
            </router-link>
            <router-link
                v-if="isAdmin"
                class="nav__item"
                :to="{ name: 'admin' }"
            >
                <icon name="adjustments" size="20" />
                <span>Admin</span>
            </router-link>
        </div>
        <router-link class="nav__item" :to="{ name: 'settings' }">
            <icon name="settings" size="20" />
            <span>{{ $t("common.settings") }}</span>
        </router-link>
    </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";
import { Icon } from "@/components/icon";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        BaseButton,
        Icon,
    },
})
export default class TheNavbar extends Vue {
    private userStore = useStore(sessionKey);
    public openBurgerMenu = false;

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
    --size: 40px;
    background-color: var(--st-background-color);
    border-right: 1px solid var(--st-border-color);

    height: auto;
    max-width: 250px;
    width: 100%;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 1000px) {
        width: auto;

        .nav__header__logo--icon {
            display: block;
            height: var(--size);
        }

        .nav__header__logo {
            display: none;
        }

        .nav__user-profile {
            display: none;
        }

        .nav__item {
            svg {
                margin: 0 auto;
            }
            span {
                display: none;
            }
        }

        .nav__item.router-link-exact-active {
            border-left: none;
        }
    }

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
            max-height: var(--size);
            margin: 0;
        }

        &__logo--icon {
            display: none;
        }
    }

    &__user-profile {
        padding: var(--st-spacing);
        display: flex;
        align-items: center;
        gap: var(--st-spacing);
        justify-self: flex-end;
        background-color: var(--st-secondary-background-color);

        &__name {
            display: flex;
            gap: calc(var(--st-spacing) * 0.5);
        }

        &__email {
            opacity: 0.5;
        }

        &__image {
            border-radius: 100%;
            max-width: var(--size);
            max-height: var(--size);
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

        display: flex;
        align-items: center;
        gap: var(--st-spacing);

        &.router-link-exact-active {
            color: var(--st-primary-color);
            position: relative;
            border-left: 5px solid var(--st-primary-color);
        }
    }
}
</style>