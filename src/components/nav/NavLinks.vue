<template>
    <div class="nav-links">
        <router-link
            class="nav-links__item nav__search-link"
            :to="{ name: 'search' }"
        >
            <icon name="search" size="20" />
            <span>{{ $t("common.search") }}</span>
        </router-link>
        <router-link class="nav-links__item" :to="{ name: 'main' }">
            <icon name="home" size="20" />
            <span>{{ $t("common.home") }}</span>
        </router-link>
        <router-link class="nav-links__item" :to="{ name: 'store-home' }">
            <icon name="collection" size="20" />
            <span>{{ $t("common.collections") }}</span>
        </router-link>
        <router-link
            v-if="isAdmin"
            class="nav-links__item"
            :to="{ name: 'admin' }"
        >
            <icon name="adjustments" size="20" />
            <span>Admin</span>
        </router-link>
        <router-link
            class="nav-links__item nav__settings"
            :to="{ name: 'settings' }"
        >
            <Icon name="settings" size="20" />
            <span>{{ $t("common.settings") }}</span>
        </router-link>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    name: "nav-links",
    components: {
        Icon,
    },
})
export default class NavLinks extends Vue {
    public get isAdmin() {
        return useStore(sessionKey).getters.isAdmin;
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.nav-links {
    display: flex;
    flex-direction: column;

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

    @include breakpoint("medium") {
        .nav-links__item {
            svg {
                margin: 0 auto;
            }
            span {
                display: none;
            }

            &.router-link-exact-active {
                border-left: none;
            }
        }
    }

    @include breakpoint("small") {
        flex-direction: initial;
        flex-grow: 0;
        margin-left: auto;
    }
}
</style>