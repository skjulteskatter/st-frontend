<template>
    <BaseCard class="relative">
        <label class="block uppercase text-xs tracking-wide mb-1">
            {{ $t("bandSync_title") }}
        </label>
        <button @click="showModal = true" class="flex items-center w-full justify-start gap-3 px-3 py-2 rounded-md border border-black/20 dark:border-white/20">
            <UserGroupIcon class="opacity-50 w-4 h-4" />
            <div class="flex-1 min-w-0 text-left">
                <p class="text-sm font-medium truncate">{{ statusText }}</p>
                <p v-if="code" class="text-xs opacity-60 font-mono tracking-wider">
                    {{ code }}
                </p>
            </div>
            <div v-if="!isActive"
                class="text-sm px-3 py-1.5 rounded-md bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 shrink-0"
            >
                {{ $t("bandSync_joinSession") }}
            </div>
        </button>
        <BandSyncModal
            :show="showModal"
            @close="showModal = false"
        />
    </BaseCard>
</template>

<script lang="ts">
import { BaseCard } from "@/components";
import BandSyncModal from "@/components/bandSync/BandSyncModal.vue";
import { useStore } from "@/store";
import { UserGroupIcon } from "@heroicons/vue/outline";
import { defineComponent } from "vue";


export default defineComponent({
    name: "band-sync-settings",
    components: {
        BaseCard,
        BandSyncModal,
        UserGroupIcon,
    },
    data: () => ({
        store: useStore(),
        showModal: false,
    }),
    computed: {
        isActive() {
            return this.store.state.bandSync.role !== "none" &&
                this.store.state.bandSync.code != null;
        },
        code() {
            return this.isActive ? this.store.state.bandSync.code : null;
        },
        statusText(): string {
            if (!this.isActive) {
                return this.$t("bandSync_settingsNotInSession") as string;
            }
            if (this.store.state.bandSync.role === "leader") {
                return this.$t("bandSync_leaderLabel") as string;
            }
            if (this.store.state.bandSync.syncStatus === "outOfSync") {
                return this.$t("bandSync_outOfSyncLabel") as string;
            }
            if (!this.store.state.bandSync.followingLeaderUpdates) {
                return this.$t("bandSync_outOfSyncLabel") as string;
            }
            return this.$t("bandSync_followingLabel") as string;
        },
    },
});
</script>
