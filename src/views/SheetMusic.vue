<template>
    <div class="sheetmusic-viewer">
        <div v-if="song" class="mb-2 p-4 bg-white">
            <div class="flex items-baseline">
                <span class="opacity-50 text-lg mr-2">{{ song.getNumber(song.collectionIds[0]) }}</span>
                <div class="flex flex-col">
                    <h1 class="font-bold text-lg mb-1 leading-tight">{{ song.getName(languageKey) }}</h1>
                    <span class="text-gray-400 text-sm md:text-base tracking-wide leading-snug md:leading-tight flex flex-col">
                        <small v-if="Authors.length">
                            <span>{{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
                            <span
                                v-for="c in Authors"
                                :key="c.id"
                                class="mr-1"
                            >
                                {{ c.name }}
                            </span>
                        </small>
                        <small v-if="Composers.length">
                            <span>{{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}</span>
                            <span
                                v-for="c in Composers"
                                :key="c.id"
                                class="mr-1"
                            >
                                {{ c.name }}
                            </span>
                        </small>
                        <small v-else>{{ $t("song_unknownComposer") }}</small>
                        <small v-if="song.verses">{{ song.verses }} {{ $t('song_verses').toLocaleLowerCase() }}</small>
                    </span>
                </div>
            </div>

            <div v-if="files.length > 1" class="mt-3 rounded-md border p-1">
                <button @click="showFiles = !showFiles" class="px-1 w-full flex gap-2 justify-between items-center text-gray-500 text-sm tracking-wide uppercase">
                    <small>{{ $t('song_sheetmusic') }}</small>
                    <ChevronUpIcon class="w-4 h-4" v-if="showFiles" />
                    <ChevronDownIcon class="w-4 h-4" v-else />
                </button>
                <MediaListItem :files="files" :callback="setFile" v-if="showFiles" class="mt-2" />
            </div>
        </div>

        <div class="sheetmusic-wrapper">
            <OpenSheetMusicDisplay
                v-if="
                    loaded &&
                    type != pdfType &&
                    options &&
                    url &&
                    ['sheet-music', 'sheet-music-embed'].includes(routeName)
                "
                :options="options"
            ></OpenSheetMusicDisplay>
            <object
                v-if="type == pdfType && options"
                :data="options.url"
                type="application/pdf"
                width="100%"
                height="100%"
                class="bg-white"
            >
                <p>Couldn't load PDF</p>
            </object>
            <div id="osmd-canvas"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { osmd } from "@/services/osmd";
import { IMediaFile } from "songtreasures-api";
import { Contributor, SheetMusicTypes, Song, transposer, User } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import http from "@/services/http";
import { session, songs } from "@/services/api";
import { MediaListItem } from "@/components/media";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/outline";
import { SheetMusicOptions } from "songtreasures";

export default defineComponent({
    name: "sheet-music",
    components: {
        OpenSheetMusicDisplay,
        MediaListItem,
        ChevronUpIcon,
        ChevronDownIcon,
    },
    data: () => ({
        store: useStore(),
        searchParams: new URLSearchParams(window.location.search),
        osmd: osmd,
        pdfType: SheetMusicTypes.PDF,
        files: [] as IMediaFile[],
        song: null as Song | null,
        user: {} as User,
        showFiles: true,
        loaded: false,
    }),
    computed: {
        languageKey() {
            return this.user?.settings?.languageKey;
        },
        Authors() {
            return this.song?.participants.filter(i => i.type === "author").map(i => i.contributor as Contributor) ?? [];
        },
        Composers() {
            return this.song?.participants.filter(i => i.type === "composer").map(i => i.contributor as Contributor) ?? [];
        },
        options() {
            return this.store.state.songs.sheetMusic;
        },
        sheetMusic() {
            return this.store.state.songs.sheetMusic ?? {} as SheetMusicOptions;
        },
        url() {
            return (
                this.sheetMusic.url ??
                `https://dmb-cdn.azureedge.net/files/${this.$route.params.id}`
            );
        },
        originalKey() {
            return (
                this.sheetMusic.originalKey ??
                this.searchParams
                    .get("originalKey")
                    ?.replace("sharp", "#")
                    .replace("flat", "b")
            );
        },
        routeName() {
            return this.$route.name?.toString() ?? "";
        },
        transposeKey() {
            return this.searchParams.get("transposition");
        },
        transposition() {
            return (
                this.sheetMusic.transposition ??
                (this.transposeKey ? parseInt(this.transposeKey) : undefined)
            );
        },
        embed() {
            const query = this.searchParams.get("embed");
            const embed = ["", "true"].includes(query ?? "false");
            return embed;
        },
        zoom() {
            const query = this.searchParams.get("zoom");
            const zoom = query ? parseInt(query) / 100 : undefined;
            return zoom;
        },
        showSheetMusic() {
            return this.sheetMusic.show;
        },
        type() {
            return (
                this.sheetMusic.type ??
                this.searchParams.get("type")
            );
        },
    },
    async mounted() {
        const c = document.getElementById("osmd-canvas");
        const pbc = document.getElementById("pb-canvas");
        const token = this.searchParams.get("token");
        await osmd.init(c, pbc);

        if (token) {
            http.setToken(token);

            const song = new Song(await songs.getSongById(this.$route.params.id as string, "participants/contributor"));
            this.user = new User(await session.getCurrentUser());

            this.song = song;
            this.files = (await songs.getSongFiles(song.id)).filter(f => f.type.startsWith("sheetmusic") && !f.type.includes("sibelius")) ?? [];
            if (this.files.length == 1) {
                this.setFile(this.files[0]);
            }
        }
        else {
            throw new Error("No token present");
        }

        this.loaded = true;
    },
    methods: {
        async setFile(file: IMediaFile) {
            this.loaded = false;

            await new Promise(r => setTimeout(r, 10));
            const options: SheetMusicOptions = {
                show: true,
                originalKey: this.song?.originalKey ?? "C",
                url: file.directUrl,
                type: file.type,
                transposition: (this.transposeKey ? parseInt(this.transposeKey) : undefined) ?? transposer.getRelativeTransposition(this.user?.settings.defaultTransposition ?? "C", true),
                zoom: this.zoom,
                clef: "treble",
            };
            this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, options);
            this.loaded = true;
        },
    },
});
</script>

<style lang="scss">
.sheetmusic-viewer {
    min-height: 100vh;
    max-width: 1600px;
    margin: auto;
    padding-bottom: 3em;
}

.sheetmusic-wrapper {
    width: 100%;
    height: 90%;
}

#pb-canvas {
    width: 100%;
    text-align: center;
}
</style>
