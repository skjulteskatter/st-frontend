<template>
    <base-card class="cursor-pointer border hover:border-gray-400" @click="goToPlaylist">
        <div class="flex gap-2">
            <icon name="playlist" class="text-gray-500" />
            <div>
                <strong class="font-bold">{{ playlist.name }}</strong>
                <div class="text-gray-500">
                    <small>
                        {{ playlist.entries.length }}
                        {{ $t("common.songs").toLowerCase() }}
                    </small>
                    <!-- <small class="playlist-card__shared">
                        {{ $t("playlist.sharedwith") }}
                        {{ playlist.sharedWithIds.length }}
                    </small> -->
                </div>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";
@Options({
    props: {
        playlist: {
            type: Object,
            required: true,
        },
    },
})
export default class PlaylistCard extends Vue {
    public playlist: ApiPlaylist = {} as ApiPlaylist;

    public goToPlaylist() {
        if (!this.playlist.id) return;

        this.$router.push({
            name: "playlist-view",
            params: { id: this.playlist.id },
        });
    }
}
</script>
