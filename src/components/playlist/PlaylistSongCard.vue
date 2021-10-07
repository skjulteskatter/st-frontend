<template>
    <transition
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-2"
    >
        <base-card :class="['group', disabled ? 'opacity-50' : 'cursor-pointer']">
            <div class="flex gap-4 items-center">
                <SelectorIcon class="w-5 h-5 opacity-50 cursor-move" />
                <button @click="goToSong" class="text-left flex-grow rounded focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2">
                    <div class="flex flex-col">
                        <span class="font-semibold">
                            {{ song?.getName() }}
                        </span>
                        <small v-for="collection in Collections" :key="collection.id" class="text-gray-500 dark:text-gray-400">
                            {{ collection.getName() }}
                            {{ song?.getNumber(collection.id) }}
                        </small>
                    </div>
                </button>
                <button
                    :title="`${$t('playlist_remove')} ${$t('common_song').toLocaleLowerCase()}`"
                    :aria-label="`${$t('playlist_remove')} ${$t('common_song').toLocaleLowerCase()}`"
                    class="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 invisible group-hover:visible"
                    v-if="canEdit"
                    @click="remove"
                >
                    <TrashIcon class="h-4 w-4 opacity-50" />
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
import { SelectorIcon, TrashIcon } from "@heroicons/vue/solid";

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
        TrashIcon,
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
