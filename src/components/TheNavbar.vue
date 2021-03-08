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
            <full-search-input></full-search-input>
        </div>
        <div class="nav__links">
            <router-link class="nav__item" :to="{ name: 'search' }">
                <icon name="search" size="20" />
                <span>{{ $t("common.search") }}</span>
            </router-link>
            <router-link class="nav__item" :to="{ name: 'main' }">
                <icon name="home" size="20" />
                <span>{{ $t("common.home") }}</span>
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
            <router-link
                class="nav__item nav__settings"
                :to="{ name: 'settings' }"
            >
                <Icon name="settings" size="20" />
                <span>{{ $t("common.settings") }}</span>
            </router-link>
        </div>
        <collection-list></collection-list>
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
            <Icon
                name="settings"
                @click="$router.push({ name: 'settings' })"
                style="cursor: pointer"
            />
        </div>
    </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";
import { Icon } from "@/components/icon";
import { FullSearchInput } from "@/components/inputs";
import { CollectionList } from "@/components/nav";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        BaseButton,
        Icon,
        CollectionList,
        FullSearchInput,
    },
})
export default class TheNavbar extends Vue {
    private userStore = useStore(sessionKey);

    public get isAdmin() {
        return useStore(sessionKey).getters.isAdmin;
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

        .nav__links {
            flex-direction: initial;
            flex-grow: 0;
            margin-left: auto;
        }
    }

    @include breakpoint("medium") {
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

        .nav__settings {
            display: flex !important;
        }

        .nav__item.router-link-exact-active {
            border-left: none;
        }
    }

    &__settings {
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

    &__links {
        display: flex;
        flex-direction: column;
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

    &__user-profile {
        display: flex;
        align-items: center;
        gap: var(--st-spacing);

        padding: var(--st-spacing);
        background-color: var(--st-color-background-medium);

        text-overflow: ellipsis;
        font-size: 0.9em;
        white-space: nowrap;

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
            object-fit: cover;
        }
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
            color: var(--st-color-primary);
            position: relative;
            border-left: 5px solid var(--st-color-primary);
        }
    }
}
</style>