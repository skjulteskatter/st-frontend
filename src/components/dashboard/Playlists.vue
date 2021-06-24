<template>
    <base-card>
        <div class="flex justify-between items-center mb-4">
            <span class="flex gap-4 items-center">
                <h3 class="font-bold">
                    {{ $t("common.playlists") }}
                </h3>
                <tooltip :text="$t('tooltip.playlists')" />
            </span>
            <button class="text-sm p-2 rounded bg-black bg-opacity-10 flex gap-2 items-center hover:bg-opacity-20" @click="openCreatePlaylist">
                {{ $t('playlist.createnew') }}
            </button>
            <create-playlist-modal :show="createPlaylist" @close="closeCreatePlaylist" />
        </div>
        <div class="flex flex-col gap-2" v-if="playlists.length">
            <router-link
                class="flex gap-2 p-2 text-xs relative rounded bg-white border hover:border-gray-400 dark:bg-secondary dark:border-gray-500 dark:hover:border-gray-400 focus:outline-none focus:ring focus:ring-primary ring-offset-2"
                v-for="p in playlists"
                :key="p.id"
                :to="playlistLink(p)"
            >
                <icon name="playlist" class="text-gray-500 dark:text-gray-400" />
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
        <p class="p-4 text-gray-500 text-center" v-else>
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
