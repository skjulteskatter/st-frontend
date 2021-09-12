<template>
    <base-card>
        <template #header>
            <div class="flex justify-between items-center">
                <span class="flex items-center">
                    <h2 class="font-bold mr-4">
                        {{ $t("common.my") + " " + $t("common.collections").toLowerCase() }}
                    </h2>
                    <tooltip :text="$t('tooltip.myCollections')" />
                </span>
                <button aria-label="Create new personal collection" class="text-sm py-1 px-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10" @click="openCreatePlaylist">
                    <PlusIcon class="w-4 h-4" />
                </button>
                <create-playlist-modal :show="createPlaylist" @close="closeCreatePlaylist" />
            </div>
        </template>
        <div class="flex flex-col gap-2" v-if="playlists.length">
            <router-link
                class="flex p-2 text-xs relative rounded-md hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
                v-for="p in playlists"
                :key="p.id"
                :to="playlistLink(p)"
            >
                <FolderIcon class="w-4 h-4 mr-2 opacity-40" />
                <div>
                    <span class="text-xs font-medium">
                        {{ p.name }}
                    </span>
                    <small class="opacity-50 block tracking-wider">
                        {{ p.entries.length || $t('common.no-amount') }}
                        {{ $t("common.songs").toLowerCase() }}
                    </small>
                </div>
            </router-link>
        </div>
        <p class="p-4 opacity-50 text-center" v-else>
            {{ $t("common.no-amount") }} {{ $t('common.collections').toLocaleLowerCase() }}
        </p>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CreatePlaylistModal } from "@/components/playlist";
import { useStore } from "@/store";
import { ApiPlaylist } from "dmb-api";
import { PlusIcon, FolderIcon } from "@heroicons/vue/solid";

@Options({
    name: "dashboard-playlists",
    components: {
        CreatePlaylistModal,
        PlusIcon,
        FolderIcon,
    },
})
export default class Playlists extends Vue {
    private store = useStore();

    public createPlaylist = false;

    public openCreatePlaylist() {
        this.createPlaylist = true;
    }

    public closeCreatePlaylist() {
        this.createPlaylist = false;
    }

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
