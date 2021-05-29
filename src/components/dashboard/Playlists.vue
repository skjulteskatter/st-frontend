<template>
    <base-card>
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold">
                {{ $t("common.playlists") }}
            </h3>
            <create-playlist-modal />
        </div>
        <div class="flex flex-col gap-2" v-if="playlists.length">
            <router-link
                class="rounded bg-white p-2 text-xs border hover:border-gray-400 flex gap-2 items-center"
                v-for="p in playlists"
                :key="p.id"
                :to="playlistLink(p)"
            >
                <icon name="playlist" class="text-gray-500" />
                <div>
                    <strong>
                        {{ p.name }}
                    </strong>
                    <small class="text-gray-400 block">
                        {{ p.entries.length }}
                        {{ $t("common.songs").toLowerCase() }}
                    </small>
                </div>
            </router-link>
        </div>
        <p class="p-4 bg-gray-100 rounded text-center" v-else>
            {{ $t("playlist.noplaylists") }}
        </p>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CreatePlaylistModal } from "@/components/playlist";
import { useStore } from "@/store";
import { ApiPlaylist } from "dmb-api";

@Options({
    name: "dashboard-playlists",
    components: {
        CreatePlaylistModal,
    },
})
export default class Playlists extends Vue {
    private store = useStore();

    public playlistLink(playlist: ApiPlaylist) {
        return {
            name: "playlist-view",
            params: {
                id: playlist.id,
            },
        };
    }

    public get playlists(): ApiPlaylist[] {
        return this.store.state.session.playlists;
    }
}
</script>
