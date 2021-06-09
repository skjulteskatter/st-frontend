<template>
    <base-card class="theme-card" v-if="title && Songs.length > 0">
        <div class="flex justify-between mb-3">
            <b
                :class="{ 'border hover:border-gray-400 bg-black bg-opacity-10 rounded px-1 cursor-pointer dark:bg-white dark:bg-opacity-20 dark:border-none dark:hover:bg-opacity-30': action != undefined }"
                @click="action"
                >{{ title }}</b
            >
            <b class="text-gray-500" v-if="count">{{ Songs.length }}</b>
        </div>
        <ul class="text-xs">
            <li
                v-for="song in Songs"
                :key="song.id"
                @click="available(song.number) ? selectSong(song) : undefined"
                class="flex gap-2 hover:text-primary hover:underline cursor-pointer dark:opacity-90"
                :class="{
                    'text-red-700': anotherLanguage.includes(song),
                    'text-gray-500': !available(song.number),
                    'text-green-700': !song.sheetMusic.length,
                }"
            >
                <b class="w-6 text-right">
                    {{ song.number }}
                </b>
                <span>
                    {{ song.getName(languageKey) }}
                </span>
                <span class="ml-auto" style="opacity: 0.5">({{songViews(song)}})</span>
                <icon class="text-primary" name="star" size="12" v-if="song.newMelody" />
            </li>
        </ul>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Collection, Song } from "@/classes";
import { useStore } from "@/store";
import { appSession } from "@/services/session";

@Options({
    props: {
        title: {
            type: String,
        },
        songs: {
            type: Array,
        },
        count: {
            type: Boolean,
            default: true,
        },
        action: {
            type: Function,
        },
        collection: {
            type: Object,
        },
    },
    name: "song-list-card",
})
export default class SongListCard extends Vue {
    private store = useStore();
    public songs?: Song[];
    public title?: string;
    public count?: boolean;
    public action?: Function;
    public collection?: Collection;

    public get Songs() {
        return this.songs ?? [];
    }

    public songViews(song: Song) {
        return appSession.Views[song.id] ?? 0;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public selectSong(song: Song) {
        const collection = this.store.getters.collections.find(c => song.collectionIds.some(col => col == c.id));
        if (collection) {
            this.$router.push({
                name: "song",
                params: {
                    number: song.number,
                    collection: collection.key,
                },
            });
        } else {
            this.$router.push({
                name: "song",
                params: { number: song.number },
            });
        }
    }

    public get anotherLanguage() {
        return this.Songs.filter(
            (s) => s.type == "lyrics" && !s.name[this.languageKey],
        );
    }

    public available(n: number) {
        return this.collection?.available || n <= 5;
    }
}
</script>

<style lang="scss">
.theme-card {
    break-inside: avoid;

    @supports not (gap: 1rem) {
        margin-bottom: var(--st-spacing);
    }
}
</style>
