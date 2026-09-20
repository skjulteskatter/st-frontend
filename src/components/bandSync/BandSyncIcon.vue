<template>
    <Tooltip :text="tooltipText" v-if="tooltipText">
        <button
            type="button"
            class="relative p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            :aria-label="tooltipText"
            @click="$emit('open')"
        >
            <UserGroupIcon class="w-6 h-6 opacity-80" />
            <span
                v-if="indicatorColor"
                class="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-secondary"
                :class="indicatorColor"
            />
        </button>
    </Tooltip>
    <button
        v-else
        type="button"
        class="relative p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
        :aria-label="$t('bandSync_title')"
        @click="$emit('open')"
    >
        <UserGroupIcon class="w-6 h-6 opacity-80" />
    </button>
</template>

<script lang="ts">
import { Tooltip } from "@/components";
import { useStore } from "@/store";
import { UserGroupIcon } from "@heroicons/vue/outline";
import { defineComponent } from "vue";

export default defineComponent({
    name: "band-sync-icon",
    components: {
        UserGroupIcon,
        Tooltip,
    },
    emits: ["open"],
    data: () => ({
        store: useStore(),
    }),
    computed: {
        isActive() {
            return this.store.state.bandSync.role !== "none" &&
                this.store.state.bandSync.code != null;
        },
        indicatorColor(): string | null {
            if (!this.isActive) return null;

            if (this.store.state.bandSync.role === "leader") {
                return "bg-primary";
            }

            if (!this.store.state.bandSync.followingLeaderUpdates) {
                return "bg-red-500";
            }

            if (this.store.state.bandSync.syncStatus === "outOfSync") {
                return "bg-red-500";
            }

            return "bg-green-500";
        },
        tooltipText(): string | null {
            if (!this.isActive) return null;

            if (this.store.state.bandSync.role === "leader") {
                return this.$t("bandSync_leaderLabel") as string;
            }

            if (!this.store.state.bandSync.followingLeaderUpdates) {
                return this.$t("bandSync_outOfSyncLabel") as string;
            }

            if (this.store.state.bandSync.syncStatus === "outOfSync") {
                return this.$t("bandSync_outOfSyncLabel") as string;
            }

            return this.$t("bandSync_followingLabel") as string;
        },
    },
});
</script>
