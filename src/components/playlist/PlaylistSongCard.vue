<template>
    <transition
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-2"
    >
        <base-card :class="['hover:ring-2 hover:ring-gray-400', disabled ? 'opacity-50' : 'cursor-pointer']">
            <div class="flex gap-4 items-center">
                <SelectorIcon class="w-5 h-5 opacity-50 cursor-move" />
                <div @click="goToSong" class="flex-grow rounded focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2">
                    <div class="flex flex-col">
                        <span class="font-semibold">
                            {{ song?.getName() }}
                        </span>
                        <small v-for="collection in Collections" :key="collection.id" class="text-gray-500 dark:text-gray-400">
                            {{ collection.getName() }}
                            {{ song?.getNumber(collection.id) }}
                        </small>
                    </div>
                </div>
                <button
                    class="text-xs tracking-wide text-red-500 px-2 py-1 rounded-md hover:bg-red-500/10 cursor-pointer dark:text-red-400"
                    v-if="canEdit"
                    @click="remove"
                >
                    {{ $t("playlist_remove") }}
                </button>
            </div>
        </base-card>
    </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylistEntry } from "dmb-api";
import { Song } from "@/classes";
import { useStore } from "@/store";
import { appSession } from "@/services/session";
import { songs } from "@/services/api";
import { SelectorIcon } from "@heroicons/vue/solid";

@Options({
    name: "playlist-song-card",
    props: {
        entry: {
            type: Object,
            required: true,
        },
        canEdit: {
            type: Boolean,
        },
    },
    components: {
        SelectorIcon,
    },
    emits: [
        "remove",
    ],
})
export default class PlaylistSongCard extends Vue {
    private store = useStore();
    public entry?: ApiPlaylistEntry;
    public song: Song | null = null;
    public canEdit?: boolean;

    public get disabled() {
        return this.song?.available !== true;
    }

    public get Collections() {
        return this.song?.Collections ?? [];
    }

    public async mounted() {
        this.song = appSession.songs.find(s => s.id == this.entry?.songId) ?? null;

        if (!this.song && this.entry) {
            this.song = new Song(await songs.getSongById(this.entry?.songId));
        }
    }

    public goToSong() {
        if (this.disabled)
            return;
        const collection = this.Collections[0];

        if (collection) {
            this.$router.push({
                name: "song",
                params: {
                    collection: collection.key,
                    number: this.song?.getNumber(collection.id),
                },
            });
        }
    }

    public remove() {
        this.$emit("remove", this.entry?.id);
    }

    public get userId() {
        return this.store.getters.user?.id;
    }
}
</script>
