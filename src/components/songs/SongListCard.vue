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
                @click="viewSong(song)"
                class="flex hover:text-primary hover:underline cursor-pointer dark:opacity-90"
                :class="{
                    'text-red-700': song.available && song.anotherLanguage(languageKey),
                    'text-green-700': song.available && !song.sheetMusic.length,
                    'opacity-40': !song.available,
                }"
            >
                <b class="w-6 mr-2 text-right">
                    {{ song.number }}
                </b>
                <span>
                    {{ song.getName(languageKey) }}
                </span>
                <div class="flex-grow flex items-center">
                    <StarIcon class="w-3 h-3 text-primary ml-1" v-if="song.newMelody" />
                    <span class="ml-auto opacity-50">({{ songViews(song) }})</span>
                </div>
            </li>
        </ul>
        <base-modal
            :show="showCTA"
            @close="closeCTA"
        >
            <div class="flex flex-col gap-4 items-center">
                <LockClosedIcon class="mt-2 w-16 h-16 text-primary" />
                <span class="text-center">
                    <h3 class="font-bold text-xl">{{ $t('store.limitedAccess') }}</h3>
                    <p>{{ $t('store.gainAccess') }}</p>
                </span>
                <base-button theme="secondary" @click="closeCTA">
                    <template #icon>
                        <CheckIcon class="w-4 h-4" />
                    </template>
                    OK
                </base-button>
            </div>
        </base-modal>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Collection, Song } from "@/classes";
import { useStore } from "@/store";
import { appSession } from "@/services/session";
import { BaseModal } from "@/components";
import { StarIcon, LockClosedIcon, CheckIcon } from "@heroicons/vue/solid";

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
    components: {
        BaseModal,
        StarIcon,
        LockClosedIcon,
        CheckIcon,
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
    
    public showCTA = false;

    public get Songs() {
        return this.songs ?? [];
    }

    public songViews(song: Song) {
        return appSession.Views[song.id] ?? 0;
    }

    public viewSong(song: Song) {
        if(!song.available) {
            return this.openCTA();
        }
        song.view();
    }

    public openCTA() {
        this.showCTA = true;
    }

    public closeCTA() {
        this.showCTA = false;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get anotherLanguage() {
        return this.Songs.filter(
            (s) => s.type == "lyrics" && !s.name[this.languageKey],
        );
    }

    public available(n: number) {
        return this.collection?.available || (this.collection?.freeSongs && n <= 5);
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
