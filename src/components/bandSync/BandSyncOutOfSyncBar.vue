<template>
    <div
        v-if="show"
        class="flex flex-wrap items-center justify-between fixed bottom-4 right-4 gap-3 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm"
    >
        <p class="font-medium">{{ $t("bandSync_outOfSyncLabel") }}</p>
        <BaseButton theme="secondary" @click="resync">
            {{ $t("bandSync_resync") }}
        </BaseButton>
    </div>
</template>

<script lang="ts">
import { resyncBandSyncToLeader } from "@/services/bandSync/bandSyncCoordinatorRegistry";
import { useStore } from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
    name: "band-sync-out-of-sync-bar",
    data: () => ({
        store: useStore(),
    }),
    computed: {
        show(): boolean {
            const bandSync = this.store.state.bandSync;
            return (
                bandSync.role === "member" &&
                bandSync.code != null &&
                (!bandSync.followingLeaderUpdates ||
                    bandSync.syncStatus === "outOfSync")
            );
        },
    },
    methods: {
        resync() {
            return resyncBandSyncToLeader();
        },
    },
});
</script>
