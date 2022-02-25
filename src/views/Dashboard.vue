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
import {
    ActivityFeed,
    Playlists,
    OwnedCollections,
} from "@/components/dashboard";
import { appSession } from "@/services/session";

export default defineComponent({
    name: "dashboard-view",
    components: {
        ActivityFeed,
        Playlists,
        OwnedCollections,
    },
    computed: {
        user() {
            return appSession.user;
        },
    },
});
</script>
