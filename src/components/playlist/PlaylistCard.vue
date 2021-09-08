<template>
    <button class="text-left rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2" @click="goToPlaylist">
        <base-card class="h-full cursor-pointer hover:ring-2 hover:ring-gray-400">
            <div class="flex gap-4">
                <FolderIcon class="w-6 h-6 opacity-50" />
                <span>
                    <strong class="font-bold md:max-w-md md:overflow-x-hidden md:overflow-ellipsis md:whitespace-nowrap">{{ playlist?.name }}</strong>
                    <small class="opacity-50 block">
                        {{ playlist?.entries.length || $t('common.no-amount') }}
                        {{ $t("common.songs").toLowerCase() }}
                    </small>
                </span>
            </div>
            <template #footer v-if="playlist?.sharedWithIds.length">
                <small class="ml-auto w-max flex gap-2 items-center" :class="[userId != playlist?.userId ? 'text-primary' : 'opacity-50']">
                    <ShareIcon class="w-3 h-3" />
                    <span v-if="userId != playlist?.userId">{{ $t('playlist.sharedWithYou') }}</span>
                    <span v-else>{{ `${$t('playlist.sharedWith')} ${playlist?.sharedWithIds.length}` }}</span>
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
