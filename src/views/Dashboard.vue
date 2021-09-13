<template>
    <div v-if="user">
        <h1 class="font-bold text-2xl mb-4">
            {{ $t("common_welcome") }}, {{ user.displayName }}
        </h1>
        <div class="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <owned-collections />
            <activity-feed />
            <playlists />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";

import { CollectionCard } from "@/components";
import {
    ActivityFeed,
    Playlists,
    OwnedCollections,
} from "@/components/dashboard";

@Options({
    name: "dashboard",
    components: {
        CollectionCard,
        ActivityFeed,
        Playlists,
        OwnedCollections,
    },
})
export default class Dashboard extends Vue {
    public store = useStore();

    public get user() {
        return this.store.getters.user;
    }
}
</script>
