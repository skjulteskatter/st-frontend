<template>
    <base-card class="theme-card" v-if="title && Songs.length > 0">
        <template #header>
            <div class="flex justify-between">
                <b
                    :class="{ 'hover:bg-black/10 bg-black/5 rounded px-2 cursor-pointer dark:bg-white/10 dark:hover:bg-white/20': action != undefined }"
                    @click="action"
                    >{{ title }}</b
                >
                <b class="text-gray-500" v-if="count">{{ Songs.length }}</b>
            </div>
        </template>
        <ul class="text-xs">
            <li
                v-for="song in Songs"
                :key="song.id"
                @click="viewSong(song)"
                class="flex hover:text-primary hover:underline cursor-pointer dark:opacity-90"
                :class="{
                    'text-red-700': song.available && song.anotherLanguage(),
                    'text-green-700': song.available && !this.songsWithSheetMusic.includes(song.id),
                    'opacity-40': !song.available,
                }"
            >
                <b class="w-6 mr-2 text-right">
                    {{ song.number }}
                </b>
                <span>
                    {{ song.getName() }}
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

    public get songsWithAudioFiles() {
        return appSession.files.filter(i => i.type === "audio").map(i => i.songId).reduce((a, b) => !a.includes(b) ? [...a, b] : a, [] as string[]);
    }

    public get songsWithVideoFiles() {
        return appSession.files.filter(i => i.type === "video").map(i => i.songId).reduce((a, b) => !a.includes(b) ? [...a, b] : a, [] as string[]);
    }
    
    public get songsWithSheetMusic() {
        return appSession.files.filter(i => ["sheetmusic", "sheetmusic-pdf"].includes(i.type)).map(i => i.songId).reduce((a, b) => !a.includes(b) ? [...a, b] : a, [] as string[]);
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
