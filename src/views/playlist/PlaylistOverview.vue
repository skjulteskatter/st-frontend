<template>
    <h1 class="font-bold text-xl md:text-2xl mb-4">
        {{ $t("common_your") }}
        {{ $t("common_collections").toLowerCase() }}
    </h1>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <playlist-card
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
            @delete="confirmDelete"
        />
        <button @click="openCreatePlaylist" class="p-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col justify-center items-center hover:bg-black/5 hover:border-transparent dark:border-white/5 dark:hover:bg-white/5 dark:hover:border-transparent">
            <FolderAddIcon class="w-8 h-8 opacity-50" />
            <p class="tracking-wide">{{ $t('playlist_createnew') }}</p>
        </button>
    </div>
    <create-playlist-modal :show="createPlaylist" @close="closeCreatePlaylist" />
    <base-modal :show="showModal" @close="showModal = false">
            <template #icon>
                <ExclamationIcon class="w-6 h-6 text-red-500" />
            </template>
            <template #title>
                <h3 class="font-bold">{{ $t('playlist_deleteConfirmation') }}</h3>
            </template>
            <template #description>
                <small class="opacity-50 tracking-wide">{{ $t('playlist_deleteDescription') }}</small>
            </template>
            <div class="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <base-button theme="tertiary" @click="showModal = false">
                    {{ $t('common_cancel') }}
                </base-button>
                <base-button theme="error" @click="deletePlaylist">
                    <template #icon>
                        <TrashIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common_delete') }}
                </base-button>
            </div>
        </base-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";

import { BaseModal } from "@/components";
import { BaseInput } from "@/components/inputs";
import { PlaylistCard, CreatePlaylistModal } from "@/components/playlist";
import { FolderIcon, PencilIcon, TrashIcon } from "@heroicons/vue/solid";
import { FolderAddIcon, ExclamationIcon } from "@heroicons/vue/outline";
import { useStore } from "@/store";
import { notify } from "@/services/notify";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
    name: "playlist-overview",
    components: {
        BaseModal,
        PlaylistCard,
        CreatePlaylistModal,
        BaseInput,
        FolderIcon,
        FolderAddIcon,
        PencilIcon,
        TrashIcon,
        ExclamationIcon,
    },
})
export default class PlaylistOverview extends Vue {
    private store = useStore();
    public createPlaylist = false;
    public showModal = false;
    public playlistId = "";
    public playlistName = "";

    public confirmDelete(playlist: {
        id: string;
        name: string;
    }) {
        this.playlistId = playlist.id;
        this.playlistName = playlist.name;
        this.showModal = true;
    }

    public async deletePlaylist() {
        await this.store.dispatch(
            SessionActionTypes.PLAYLIST_DELETE,
            this.playlistId,
        );
        this.showModal = false;

        notify("success",  this.$t("playlist_deletedplaylist"), "trash", `${this.$t("playlist_deletedplaylist")} "${this.playlistName}"`, undefined, undefined, false);
    }

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
