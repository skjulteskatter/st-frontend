<template>
    <button class="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 p-4 flex gap-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ring-offset-2 dark:border-gray-500 dark:hover:border-gray-400">
        <FolderIcon class="w-5 h-5 opacity-50" />
        <div class="flex flex-col">
            <p class="font-semibold">{{ playlist?.name }}</p>
            <small class="text-gray-500 tracking-wide text-left dark:text-gray-400">
                {{ playlist?.entries.length }}
                {{ $t("common_songs").toLowerCase() }}
            </small>
        </div>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ICustomCollection } from "songtreasures";
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
    public playlist?: ICustomCollection;

    public goToPlaylist() {
        if (!this.playlist?.id) return;

        this.$router.push({
            name: "playlist-view",
            params: { id: this.playlist.id },
        });
    }
}
</script>
