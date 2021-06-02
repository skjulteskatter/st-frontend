<template>
    <base-card class="cursor-pointer border hover:border-gray-400">
        <button class="flex gap-2 w-full rounded focus:outline-none focus:ring focus:ring-primary ring-offset-2" @click="goToPlaylist">
            <icon name="playlist" class="text-gray-500" />
            <div class="flex flex-col">
                <strong class="font-bold">{{ playlist?.name }}</strong>
                <small class="text-gray-500 text-left">
                    {{ playlist?.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </small>
            </div>
        </button>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";
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

    public goToPlaylist() {
        if (!this.playlist?.id) return;

        this.$router.push({
            name: "playlist-view",
            params: { id: this.playlist.id },
        });
    }
}
</script>
