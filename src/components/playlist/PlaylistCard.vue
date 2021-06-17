<template>
    <base-card class="cursor-pointer border hover:border-gray-400 dark:border-gray-500 dark:hover:border-gray-400"
        :class="{
            'bg-yellow-50': userId != playlist?.userId, 
        }"
    >
        <button class="text-left flex gap-4 w-full rounded focus:outline-none focus:ring focus:ring-primary ring-offset-2" @click="goToPlaylist">
            <icon name="playlist" class="text-gray-500 dark:text-gray-400" />
            <div class="flex flex-col">
                <strong class="font-bold md:max-w-md md:overflow-x-hidden md:overflow-ellipsis md:whitespace-nowrap">{{ playlist?.name }}</strong>
                <small class="text-gray-500 dark:text-gray-400">
                    {{ playlist?.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </small>
            </div>
            <small
                class="text-gray-400 ml-auto flex-shrink-0"
                v-if="playlist?.sharedWithIds.length"
            >
                <icon name="share" size="16" />
                {{ `${$t('playlist.sharedWith')} ${playlist?.sharedWithIds.length}` }}
            </small>
        </button>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";
import { useStore } from "@/store";
@Options({
    name: "playlist-card",
    props: {
        playlist: {
            type: Object,
            required: true,
        },
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
