<template>
    <button class="cursor-pointer border hover:border-gray-400 p-4 flex gap-2 w-full rounded-md focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:border-gray-500 dark:hover:border-gray-400">
        <FolderIcon class="w-5 h-5 opacity-50" />
        <div class="flex flex-col">
            <strong class="font-bold">{{ playlist?.name }}</strong>
            <small class="text-gray-500 text-left dark:text-gray-400">
                {{ playlist?.entries.length }}
                {{ $t("common.songs").toLowerCase() }}
            </small>
        </div>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";
import { FolderIcon } from "@heroicons/vue/outline";

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
    },
})
export default class PlaylistCard extends Vue {
    public playlist?: ApiPlaylist;

    public goToPlaylist() {
        if (!this.playlist?.id) return;

        this.$router.push({
            name: "playlist-view",
            params: { id: this.playlist.id },
        });
    }
}
</script>
