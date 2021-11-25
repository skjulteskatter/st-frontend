<template>
    <transition
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-2"
    >
        <BaseCard :class="['group', disabled ? 'opacity-50' : 'cursor-pointer']">
            <div class="flex gap-4 items-center">
                <SelectorIcon class="w-5 h-5 opacity-50 cursor-move" />
                <button @click="goToSong" class="text-left flex-grow rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2">
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
        </BaseCard>
    </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { ICustomCollectionEntry } from "songtreasures";
import { Song } from "@/classes";
import { useStore } from "@/store";
import { appSession } from "@/services/session";
import { songs } from "@/services/api";
import { SelectorIcon, TrashIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "playlist-song-card",
    props: {
        entry: {
            type: Object as PropType<ICustomCollectionEntry>,
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
    data: () => ({
        store: useStore(),
        song: null as Song | null,
    }),
    emits: ["remove"],
    computed: {
        userId() {
            return this.store.getters.user?.id;
        },
        disabled() {
            return this.song?.available !== true;
        },
        Collections() {
            return this.song?.Collections ?? [];
        },
    },
    methods: {
        async mounted() {
            this.song = appSession.songs.find(s => s.id == this.entry?.songId) ?? null;

            if (!this.song && this.entry) {
                this.song = new Song(await songs.getSongById(this.entry?.songId));
            }
        },
        goToSong() {
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
        },
        remove() {
            this.$emit("remove", this.entry?.id);
        },
    },
});
</script>
