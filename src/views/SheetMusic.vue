<template>
    <div class="min-h-screen max-w-screen-2xl m-auto pb-12">
        <div v-if="song" class="mb-2 p-4 bg-white">
            <div class="flex items-baseline">
                <span class="opacity-50 text-lg mr-2">{{ number }}</span>
                <div class="flex flex-col">
                    <h1 class="font-bold text-lg mb-1 leading-tight">{{ song.title }}</h1>
                    <span class="text-gray-400 text-sm md:text-base tracking-wide leading-snug md:leading-tight flex flex-col">
                        <small v-if="authors.length">
                            <span>{{ (song.yearWritten ? $t("song_writtenInBy").replace('$year', song.yearWritten.toString()) : $t("song_writtenBy")).replace('$authors', '') }}</span>
                            <span
                                v-for="c in authors"
                                :key="c.id"
                                class="mr-1"
                            >
                                {{ c.name }}
                            </span>
                        </small>
                        <small v-if="composers.length">
                            <span>{{ (song.yearComposed ? $t("song_composedInBy").replace('$year', song.yearComposed.toString()) : $t("song_composedBy")).replace('$composers', '') }}</span>
                            <span
                                v-for="c in composers"
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

        <div class="w-full h-5/6">
            <OpenSheetMusicDisplay
                v-if="
                    loaded &&
                    type != pdfType &&
                    options &&
                    url &&
                    ['sheet-music', 'sheet-music-embed'].includes(routeName)
                "
                :options="options"
                :relativeKey="user?.settings.defaultTransposition ?? 'C'"
                :showInfo="false"
                :song="(song as any)"
                :collection="(collection as any)"
                :languageKey="languageKey"
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
<script lang="ts" setup>
const searchParams = new URLSearchParams(window.location.search);
const token = searchParams.get("token");

if (!token) {
    throw new Error("Token not present");
}
client.setToken(token);

const songId = useRoute().params.songId;
const song = await songService.get(songId as string);
const collectionId = song.collections[0]?.collectionId ?? null;
const collection = collectionId ? await collectionService.get(collectionId) : null;

const number =  song.collections.find(c => c.collectionId === collectionId)?.number ?? null;

const contributors = await contributorService.retrieve({
    itemIds: song.participants.map(i => i.contributorId),
});
const authors = computed(() => {
    return contributors.filter(c => song.participants.some(p => p.type === "author" && p.contributorId === c.id));
});
const composers = computed(() => {
    return contributors.filter(c => song.participants.some(p => p.type === "composer" && p.contributorId === c.id));
});

</script>
<script lang="ts">
import { defineComponent, computed } from "@vue/runtime-core";
import { Collection, SheetMusicTypes, Song, transposer, User } from "@/classes";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import http from "@/services/http";
import { session, songs } from "@/services/api";
import { MediaListItem } from "@/components/media";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/outline";
import { SheetMusicOptions } from "songtreasures";
import client from "@/services/client";
import songService from "@/services/songs/songService";
import { useRoute } from "vue-router";
import { IMediaFile } from "hiddentreasures-js";
import collectionService from "@/services/collectionService";
import contributorService from "@/services/contributorService";

export default defineComponent({
    name: "sheet-music",
    components: {
        OpenSheetMusicDisplay,
        MediaListItem,
        ChevronUpIcon,
        ChevronDownIcon,
    },
    data: () => ({
        searchParams: new URLSearchParams(window.location.search),
        pdfType: SheetMusicTypes.PDF,
        files: [] as IMediaFile[],
        song: null as Song | null,
        showFiles: true,
        loaded: false,
    }),
    methods: {
    },
});
</script>
