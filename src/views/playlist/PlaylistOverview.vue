<template>
    <header class="flex justify-between items-center mb-4">
        <h1 class="font-bold text-xl md:text-2xl">
            {{ $t("common.your") }}
            {{ $t("common.playlists").toLowerCase() }}
        </h1>
        <base-button @click="openCreatePlaylist" theme="secondary" icon="playlist">{{$t('playlist.createnew')}}</base-button>
        <create-playlist-modal :show="createPlaylist" @close="closeCreatePlaylist" />
    </header>
    <div class="flex flex-col gap-4" v-if="playlists.length">
        <playlist-card
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
        />
    </div>
    <h3 class="bg-gray-300 p-4 rounded text-center" v-else>
        {{ $t("playlist.noplaylists") }}
    </h3>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";

import { BaseInput } from "@/components/inputs";
import { PlaylistCard, CreatePlaylistModal } from "@/components/playlist";
import { useStore } from "@/store";

@Options({
    name: "playlist-overview",
    components: {
        PlaylistCard,
        CreatePlaylistModal,
        BaseInput,
    },
})
export default class PlaylistOverview extends Vue {
    private store = useStore();
    public createPlaylist = false;

    public closeCreatePlaylist() {
        this.createPlaylist = false;
    }

    public openCreatePlaylist() {
        this.createPlaylist = true;
    }

    public get playlists(): ApiPlaylist[] {
        return this.store.getters.playlists;
    }
}
</script>
