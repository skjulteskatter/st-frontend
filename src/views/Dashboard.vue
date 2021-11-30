<template>
    <div v-if="user">
        <h1 class="font-bold text-2xl mb-4">
            {{ $t("common_welcome") }}, {{ user.displayName }}
        </h1>
        <div class="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <OwnedCollections />
            <ActivityFeed />
            <Playlists />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/store";
import {
    ActivityFeed,
    Playlists,
    OwnedCollections,
} from "@/components/dashboard";

export default defineComponent({
    name: "dashboard",
    components: {
        ActivityFeed,
        Playlists,
        OwnedCollections,
    },
    data: () => ({
        store: useStore(),
    }),
    computed: {
        user() {
            return this.store.getters.user;
        },
    },
});
</script>
