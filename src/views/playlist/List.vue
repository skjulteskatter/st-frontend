<template>
    <div>
        <h1 class="font-bold text-xl md:text-2xl mb-4">
            {{ $t("common_your") }}
            {{ $t("common_collections").toLowerCase() }}
        </h1>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <PlaylistCard
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
        <CreatePlaylistModal :show="createPlaylist" @close="closeCreatePlaylist" />
        <BaseModal :show="showModal" @close="showModal = false">
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
                <BaseButton theme="tertiary" @click="showModal = false">
                    {{ $t('common_cancel') }}
                </BaseButton>
                <BaseButton theme="error" @click="deletePlaylist">
                    <template #icon>
                        <TrashIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common_delete') }}
                </BaseButton>
            </div>
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ICustomCollection } from "songtreasures-api";
import { BaseModal } from "@/components";
import { PlaylistCard, CreatePlaylistModal } from "@/components/playlist";
import { TrashIcon } from "@heroicons/vue/solid";
import { FolderAddIcon, ExclamationIcon } from "@heroicons/vue/outline";
import { notify } from "@/services/notify";
import { SessionActionTypes } from "@/store/modules/session/action-types";

export default defineComponent({
    name: "playlist-list",
    components: {
        BaseModal,
        PlaylistCard,
        CreatePlaylistModal,
        FolderAddIcon,
        TrashIcon,
        ExclamationIcon,
    },
    data: () => ({
        createPlaylist: false,
        showModal: false,
        playlistId: "",
        playlistName: "",
    }),
    computed: {
        playlists(): ICustomCollection[] {
            return this.store.getters.playlists;
        },
    },
    methods: {
        confirmDelete(playlist: {
            id: string;
            name: string;
        }) {
            this.playlistId = playlist.id;
            this.playlistName = playlist.name;
            this.showModal = true;
        },
        async deletePlaylist() {
            await this.store.dispatch(
                SessionActionTypes.PLAYLIST_DELETE,
                this.playlistId,
            );
            this.showModal = false;

            notify("success",  this.$t("playlist_deletedplaylist"), "trash", `${this.$t("playlist_deletedplaylist")} "${this.playlistName}"`, undefined, undefined, false);
        },
        closeCreatePlaylist() {
            this.createPlaylist = false;
        },
        openCreatePlaylist() {
            this.createPlaylist = true;
        },
    },
});
</script>
