<template>
    <base-card>
        <div class="flex justify-between items-center mb-2">
            <span class="flex items-center">
                <h3 class="font-bold mr-4">
                    {{ $t("common.my") + " " + $t("common.collections").toLowerCase() }}
                </h3>
                <tooltip :text="$t('tooltip.myCollections')" />
            </span>
            <button class="text-sm py-1 px-2 rounded-md bg-black bg-opacity-10 hover:bg-opacity-20" @click="openCreatePlaylist">
                {{ $t('playlist.createnew') }}
            </button>
            <create-playlist-modal :show="createPlaylist" @close="closeCreatePlaylist" />
        </div>
        <div class="flex flex-col" v-if="playlists.length">
            <router-link
                class="mt-2 flex p-2 text-xs relative rounded-md bg-white border hover:border-gray-400 dark:bg-secondary dark:border-gray-500 dark:hover:border-gray-400 focus:outline-none focus:ring focus:ring-primary ring-offset-2"
                v-for="p in playlists"
                :key="p.id"
                :to="playlistLink(p)"
            >
                <icon name="playlist" class="mr-2 text-gray-500 dark:text-gray-400" />
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
        <p class="p-4 text-gray-500 dark:text-gray-400 text-center" v-else>
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
