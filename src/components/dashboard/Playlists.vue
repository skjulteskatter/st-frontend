<template>
    <BaseCard>
        <template #header>
            <div class="flex justify-between items-center">
                <span class="flex items-center">
                    <h2 class="font-bold mr-4">
                        {{ $t("common_my") + " " + $t("common_collections").toLowerCase() }}
                    </h2>
                    <Tooltip :text="$t('tooltip_myCollections')" />
                </span>
                <button aria-label="Create new personal collection" class="text-sm py-1 px-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10" @click="openCreatePlaylist">
                    <PlusIcon class="w-4 h-4" />
                </button>
                <CreatePlaylistModal :show="createPlaylist" @close="closeCreatePlaylist" />
            </div>
        </template>
        <div class="flex flex-col gap-2 shadow-scroll" v-if="playlists.length">
            <router-link
                class="flex p-2 text-xs relative rounded-md hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2"
                v-for="p in playlists"
                :key="p.id"
                :to="getPlaylistLink(p)"
            >
                <FolderIcon class="w-4 h-4 mr-2 opacity-40" />
                <div>
                    <span class="text-xs font-medium">
                        {{ p.name }}
                    </span>
                    <small class="opacity-50 block tracking-wider">
                        {{ p.entries.length || $t('common_noAmount') }}
                        {{ $t("common_songs").toLowerCase() }}
                    </small>
                </div>
            </router-link>
        </div>
        <p class="p-4 opacity-50 text-center" v-else>
            {{ $t("common_noAmount") }} {{ $t('common_collections').toLocaleLowerCase() }}
        </p>
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CreatePlaylistModal } from "@/components/playlist";
import { ICustomCollection } from "songtreasures-api";
import { PlusIcon, FolderIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "dashboard-playlists",
    components: {
        CreatePlaylistModal,
        PlusIcon,
        FolderIcon,
    },
    data: () => ({
        createPlaylist: false,
    }),
    methods: {
        openCreatePlaylist() {
            this.createPlaylist = true;
        },
        closeCreatePlaylist() {
            this.createPlaylist = false;
        },
        getPlaylistLink(playlist: ICustomCollection) {
            return {
                name: "playlist-view",
                params: {
                    id: playlist.id,
                },
            };
        },
    },
});
</script>

<style lang="scss">
@import "../../style/mixins";

.shadow-scroll {
    @include scrollShadow(white);
    max-height: 400px;
    overflow-y: auto;
}

.dark {
    .shadow-scroll {
        @include scrollShadow(#213F47);
    }
}
</style>
