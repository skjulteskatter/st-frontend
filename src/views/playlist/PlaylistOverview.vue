<template>
    <header class="flex justify-between items-center mb-4">
        <h1 class="font-bold text-xl md:text-2xl">
            {{ $t("common.your") }}
            {{ $t("common.collections").toLowerCase() }}
        </h1>
        <base-button @click="openCreatePlaylist" theme="secondary" class="sm:hidden">
            <template #icon>
                <FolderIcon class="w-4 h-4" />
            </template>
            {{$t('playlist.createnew')}}
        </base-button>
    </header>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <playlist-card
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
        />
        <button @click="openCreatePlaylist" class="p-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col justify-center items-center hover:bg-black/5 hover:border-transparent dark:border-white/5 dark:hover:bg-white/5 dark:hover:border-transparent">
            <FolderAddIcon class="w-8 h-8 opacity-50" />
            <p class="tracking-wide">{{ $t('playlist.createnew') }}</p>
        </button>
    </div>
    <create-playlist-modal :show="createPlaylist" @close="closeCreatePlaylist" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";

import { BaseInput } from "@/components/inputs";
import { PlaylistCard, CreatePlaylistModal } from "@/components/playlist";
import { FolderIcon } from "@heroicons/vue/solid";
import { FolderAddIcon } from "@heroicons/vue/outline";
import { useStore } from "@/store";

@Options({
    name: "playlist-overview",
    components: {
        PlaylistCard,
        CreatePlaylistModal,
        BaseInput,
        FolderIcon,
        FolderAddIcon,
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
