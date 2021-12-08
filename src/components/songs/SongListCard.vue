<template>
    <BaseCard class="theme-card" v-if="title && songs.length > 0">
        <template #header>
            <div class="flex justify-between">
                <b
                    :class="{ 'hover:bg-black/10 bg-black/5 rounded px-2 cursor-pointer dark:bg-white/10 dark:hover:bg-white/20': action != undefined }"
                    @click="action"
                >
                    {{ title }}
                </b>
                <b class="text-gray-500" v-if="count">{{ songs.length }}</b>
            </div>
        </template>
        <ul class="text-xs">
            <li
                v-for="song in songs"
                :key="song.id"
                :class="{
                    'text-red-700': song.available && song.anotherLanguage(),
                    'text-green-700': song.available && !songsWithSheetMusic.includes(song.id),
                    'opacity-40': !song.available,
                }"
            >
                <button @click="viewSong(song)" class="w-full text-left flex hover:text-primary hover:underline cursor-pointer dark:opacity-90">
                    <b class="w-6 flex-shrink-0 mr-2 text-right">
                        {{ song.number }}
                    </b>
                    <span>
                        {{ song.getName() }}
                    </span>
                    <div class="flex-grow flex items-baseline ml-2">
                        <StarIcon class="w-3 h-3 text-primary ml-1" v-if="song.newMelody" />
                        <span class="ml-auto opacity-50 flex items-center gap-1" v-if="isAdmin">
                            {{ song.Views }}
                            <EyeIcon class="w-3 h-3 opacity-50" />
                        </span>
                    </div>
                </button>
            </li>
        </ul>
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { appSession } from "@/services/session";
import { StarIcon, EyeIcon } from "@heroicons/vue/solid";
import { Song } from "@/classes";

export default defineComponent({
    name: "song-list-card",
    components: {
        StarIcon,
        EyeIcon,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        songs: {
            type: Array as PropType<Song[]>,
            required: true,
        },
        count: {
            type: Boolean,
            default: true,
        },
        action: {
            type: Function,
        },
        isAdmin: Boolean,
    },
    emits: ["showCta"],
    computed: {
        songsWithAudioFiles() {
            return appSession.files.filter(i => i.type === "audio").map(i => i.songId).reduce((a, b) => !a.includes(b) ? [...a, b] : a, [] as string[]);
        },
        songsWithVideoFiles() {
            return appSession.files.filter(i => i.type === "video").map(i => i.songId).reduce((a, b) => !a.includes(b) ? [...a, b] : a, [] as string[]);
        },
        songsWithSheetMusic() {
            return appSession.files.filter(i => ["sheetmusic", "sheetmusic-pdf"].includes(i.type)).map(i => i.songId).reduce((a, b) => !a.includes(b) ? [...a, b] : a, [] as string[]);
        },
    },
    methods: {
        viewSong(song: Song) {
            if(!song.available) {
                this.$emit("showCta");
            } else {
                song.view();
            }
        },
    },
});
</script>

<style lang="scss">
.theme-card {
    break-inside: avoid;

    @supports not (gap: 1rem) {
        margin-bottom: var(--st-spacing);
    }
}
</style>
