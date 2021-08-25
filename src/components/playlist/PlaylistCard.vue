<template>
    <button class="text-left rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2" @click="goToPlaylist">
        <base-card
            class="h-full cursor-pointer hover:ring-2 hover:ring-gray-400"
            :class="{ 'border border-primary': userId != playlist?.userId }"
        >
                <FolderIcon class="w-8 h-8 opacity-50 mb-2" />
                <strong class="font-bold md:max-w-md md:overflow-x-hidden md:overflow-ellipsis md:whitespace-nowrap">{{ playlist?.name }}</strong>
                <small class="opacity-50 block">
                    {{ playlist?.entries.length || $t('common.no-amount') }}
                    {{ $t("common.songs").toLowerCase() }}
                </small>
            <template #footer v-if="playlist?.sharedWithIds.length">
                <small class="ml-auto w-max opacity-50 flex gap-1 items-center">
                    <ShareIcon class="w-4 h-4" />
                    {{ `${$t('playlist.sharedWith')} ${playlist?.sharedWithIds.length}` }}
                </small>
            </template>
        </base-card>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";
import { useStore } from "@/store";
import { FolderIcon } from "@heroicons/vue/outline";
import { ShareIcon } from "@heroicons/vue/solid";

@Options({
    name: "playlist-card",
    props: {
        playlist: {
            type: Object,
            required: true,
        },
    },
    components: {
        FolderIcon,
        ShareIcon,
    },
})
export default class PlaylistCard extends Vue {
    public playlist?: ApiPlaylist;
    public userId = useStore().getters.user?.id;

    public goToPlaylist() {
        if (!this.playlist?.id) return;

        this.$router.push({
            name: "playlist-view",
            params: { id: this.playlist.id },
        });
    }
}
</script>
