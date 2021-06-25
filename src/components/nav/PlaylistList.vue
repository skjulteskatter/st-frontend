<template>
    <div class="p-4 mt-8 flex-grow text-sm hidden md:block overflow-y-auto">
        <small class="uppercase flex justify-between mb-2">
            {{ $t("common.my") + " " + $t("common.collections").toLowerCase()  }}
            <router-link class="font-bold hover:underline focus:outline-none focus:ring focus:ring-primary rounded" to="/playlists">
                {{ $t("playlist.seeall") }}
            </router-link>
        </small>
        <ul class="flex flex-col gap-2" v-if="playlists.length > 0">
            <li v-for="playlist in playlists" :key="playlist.id">
                <router-link
                    class="p-2 border hover:border-gray-400 flex gap-2 rounded focus:outline-none focus:ring focus:ring-primary dark:border-gray-500 dark:hover:border-gray-400"
                    :to="{
                        name: 'playlist-view',
                        params: { id: playlist.id },
                    }"
                >
                    <icon name="playlist" size="18" class="text-gray-500 dark:text-gray-400" />
                    <span class="overflow-x-hidden overflow-ellipsis whitespace-nowrap">{{ playlist.name }}</span>
                    <small class="ml-auto">{{ playlist.entries.length }}</small>
                </router-link>
            </li>
        </ul>
        <button
            v-if="playlists.length < 5"
            class="w-full p-2 bg-black bg-opacity-10 rounded flex gap-2 justify-center items-center mt-2 hover:bg-opacity-20"
            @click="openCreatePlaylist"
        >
            {{ $t("playlist.createnew") }}
        </button>
        <create-playlist-modal :show="createPlaylist" @close="closeCreatePlaylist" />
    </div>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { ApiPlaylist } from "dmb-api";
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import { appSession } from "@/services/session";
import { CreatePlaylistModal } from "@/components/playlist";

@Options({
    name: "playlist-list",
    components: {
        CreatePlaylistModal,
    },
})
export default class CollectionList extends Vue {
    private store = useStore();
    public createPlaylist = false;

    public openCreatePlaylist() {
        this.createPlaylist = true;
    }

    public closeCreatePlaylist() {
        this.createPlaylist = false;
    }

    public get collections(): Collection[] {
        return appSession.collections;
    }

    public get playlists(): ApiPlaylist[] {
        return this.store.state.session.playlists.slice(0, 5);
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
