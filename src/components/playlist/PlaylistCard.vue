<template>
    <base-card class="cursor-pointer hover:ring-2 hover:ring-gray-400"
        :class="{ 'border border-primary': userId != playlist?.userId }"
    >
        <button class="text-left w-full rounded focus:outline-none focus:ring focus:ring-primary ring-offset-2" @click="goToPlaylist">
            <FolderIcon class="w-8 h-8 opacity-50 mb-2" />
            <div class="flex flex-col">
                <strong class="font-bold md:max-w-md md:overflow-x-hidden md:overflow-ellipsis md:whitespace-nowrap">{{ playlist?.name }}</strong>
                <small class="opacity-50">
                    {{ playlist?.entries.length || $t('common.no-amount') }}
                    {{ $t("common.songs").toLowerCase() }}
                </small>
                <small
                    class="opacity-50 ml-auto flex-shrink-0 flex gap-1 items-center"
                    v-if="playlist?.sharedWithIds.length"
                >
                    <ShareIcon class="w-4 h-4" />
                    {{ `${$t('playlist.sharedWith')} ${playlist?.sharedWithIds.length}` }}
                </small>
            </div>
        </button>
    </base-card>
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
