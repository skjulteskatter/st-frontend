<template>
    <div class="flex flex-row sm:flex-col">
        <router-link
            class="p-4 flex md:hidden gap-4 items-center"
            :to="{ name: 'search' }"
        >
            <icon name="search" size="20" />
            <span class="hidden md:block">{{ $t("common.search") }}</span>
        </router-link>
        <router-link class="p-4 flex gap-4 items-center" :to="{ name: 'main' }">
            <icon name="home" size="20" />
            <span class="hidden md:block">{{ $t("common.home") }}</span>
        </router-link>
        <router-link class="p-4 flex gap-4 items-center" :to="{ name: 'collection-list' }">
            <icon name="book" size="20" />
            <span class="hidden md:block">{{ $t("common.collections") }}</span>
        </router-link>
        <router-link
            v-if="isAdmin"
            class="p-4 flex gap-4 items-center"
            :to="{ name: 'admin' }"
        >
            <icon name="adjustments" size="20" />
            <span class="hidden md:block">Admin</span>
        </router-link>
        <router-link
            class="p-4 flex md:hidden gap-4 items-center"
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
}
</script>

<style lang="scss">
.router-link-exact-active {
    background-color: rgb(243, 244, 246);
}
</style>
