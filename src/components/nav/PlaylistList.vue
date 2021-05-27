<template>
    <div class="p-4 mt-8 flex-grow text-sm hidden md:block">
        <small class="uppercase flex justify-between mb-2">
            {{ $t("common.playlists") }}
            <router-link class="font-bold hover:underline" to="/playlists">
                {{ $t("playlist.seeall") }}
            </router-link>
        </small>
        <ul class="flex flex-col gap-2" v-if="playlists.length > 0">
            <li v-for="playlist in playlists" :key="playlist.id">
                <router-link
                    class="p-2 border hover:border-gray-400 flex gap-2 rounded"
                    :to="{
                        name: 'playlist-view',
                        params: { id: playlist.id },
                    }"
                >
                    <icon name="playlist" size="18" class="text-gray-500" />
                    {{ playlist.name }}
                    <small class="ml-auto">{{ playlist.entries.length }}</small>
                </router-link>
            </li>
        </ul>
        <p class="p-2 bg-gray-200 text-center rounded" v-else>
            {{ $t("playlist.noplaylists") }}
        </p>
    </div>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { ApiPlaylist } from "dmb-api";
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import { appSession } from "@/services/session";
import { Icon } from "@/components/icon";

@Options({
    name: "playlist-list",
    components: {
        Icon,
    }
})
export default class CollectionList extends Vue {
    private store = useStore();

    public get collections(): Collection[] {
        return appSession.collections;
    }

    public get playlists(): ApiPlaylist[] {
        return this.store.state.session.playlists;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
