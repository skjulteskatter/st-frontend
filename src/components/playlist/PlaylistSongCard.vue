<template>
    <base-card v-if="collection && song && playlist" class="hover:ring-2 hover:ring-gray-400">
        <div class="flex gap-4 items-center">
            <SelectorIcon class="w-5 h-5 opacity-50 cursor-move" />
            <router-link
                v-if="!disabled"
                class="flex-grow rounded focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
                :to="{
                    name: 'song',
                    params: {
                        collection: collection.key,
                        number: song.number,
                    },
                }"
            >
                <div class="flex flex-col">
                    <span class="font-semibold">
                        {{ entryName }}
                    </span>
                    <small class="text-gray-500 dark:text-gray-400">
                        {{ collection.getName(languageKey) }}
                        {{ song.number }}
                    </small>
                </div>
            </router-link>
            <div v-else>
                <div class="flex flex-col" style="opacity: 0.5">
                    <span class="font-semibold">
                        {{ entryName }}
                    </span>
                    <small class="text-gray-500 dark:text-gray-400">
                        {{ collection.getName(languageKey) }}
                        {{ song.number }}
                    </small>
                </div>
            </div>
            <button
                class="text-xs tracking-wide text-red-500 px-2 py-1 rounded-md hover:bg-red-500/10 cursor-pointer dark:text-red-400"
                v-if="playlist.userId == userId"
                @click="removeFromPlaylist"
            >
                {{ $t("playlist.remove") }}
            </button>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist, ApiPlaylistEntry } from "dmb-api";
import { Song } from "@/classes";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { appSession } from "@/services/session";
import { notify } from "@/services/notify";
import { songs } from "@/services/api";
import { SelectorIcon } from "@heroicons/vue/solid";

@Options({
    name: "playlist-song-card",
    props: {
        entry: {
            type: Object,
            required: true,
        },
        playlist: {
            type: Object,
            required: true,
        },
    },
    components: {
        SelectorIcon,
    },
})
export default class PlaylistSongCard extends Vue {
    private store = useStore();
    public entry?: ApiPlaylistEntry;
    public playlist?: ApiPlaylist;
    public song: Song | null = null;
    public disabled = false;

    public async mounted() {
        this.song = appSession.songs.find(s => s.id == this.entry?.songId) ?? null;

        if (!this.song && this.entry) {
            this.song = new Song(await songs.getSongById(this.entry?.songId));
            this.disabled = !this.song.available;
        }
    }

    public async removeFromPlaylist() {
        const title = this.$t("playlist.removed");
        const content = this.$t("notification.removedsong");

        if (!this.playlist?.id || !this.entry?.id) return;
        await this.store.dispatch(SessionActionTypes.PLAYLIST_REMOVE_ENTRY, {
            playlistId: this.playlist.id,
            entryId: this.entry.id,
        });

        notify("success", title, "trash", content);
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        return appSession.collections.find(c => this.song?.collectionIds.includes(c.id));
    }

    public get entryName() {
        return this.song ? new Song(this.song).getName(this.languageKey) : "";
    }

    public get userId() {
        return this.store.getters.user?.id;
    }
}
</script>
