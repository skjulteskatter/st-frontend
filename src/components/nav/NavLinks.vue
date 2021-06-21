<template>
    <div class="flex flex-row sm:flex-col focus:outline-none focus:ring-primary focus:ring">
        <router-link
            class="p-4 flex md:hidden gap-4 items-center focus:outline-none focus:ring-primary focus:ring"
            :to="{ name: 'search' }"
        >
            <icon name="search" size="20" />
            <span class="hidden md:block">{{ $t("common.search") }}</span>
        </router-link>
        <router-link v-for="l in Links" :key="l.title" class="p-4 flex gap-4 items-center focus:outline-none focus:ring-primary focus:ring" :to="{ name: l.name }">
            <icon :name="l.icon" size="20" />
            <span class="hidden md:block">{{ l.title }}</span>
        </router-link>
        <router-link
            class="p-4 flex md:hidden gap-4 items-center focus:outline-none focus:ring-primary focus:ring"
            :to="{ name: 'settings' }"
        >
            <icon name="settings" size="20" />
            <span class="hidden md:block">{{ $t("common.settings") }}</span>
        </router-link>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";

@Options({
    name: "nav-links",
})
export default class NavLinks extends Vue {
    public get isAdmin() {
        return useStore().getters.isAdmin;
    }

    private get links() {
        return [
            {
                name: "main",
                icon: "home",
                title: this.$t("common.home"),
            },
            {
                name: "collection-list",
                icon: "book",
                title: this.$t("common.collections"),
            },
        ];
    }

    public get Links() {
        return this.isAdmin ? [
            ...this.links,
            {
                name: "admin",
                icon: "adjustments",
                title: "Admin",
            },
        ] : this.links;
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.router-link-exact-active {
    border-left: 5px solid var(--st-color-primary);
    @include breakpoint("small") {
        border-left: none;
        border-top: 5px solid var(--st-color-primary);
    }
}
</style>
