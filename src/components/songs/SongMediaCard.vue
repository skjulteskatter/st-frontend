<template>
    <BaseCard
        v-if="song"
        class="border border-primary"
    >
        <template #header>
            <div class="flex items-center gap-4">
                <h3 class="font-bold">
                    {{ $t("song_media") }}
                </h3>
                <Tooltip :text="$t('tooltip_songFiles')" />
                <a
                    target="_blank"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSd9Sqcxox4B4UbSm2WPCD_jERcX0fiQ_d6Nw13sq8T0eXr36w/viewform"
                    class="ml-auto text-sm rounded-md py-1 px-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                >{{ $t('common_contribute') }}</a>
            </div>
        </template>
        <div class="flex flex-col gap-4" v-if="(song.audioFiles.length || song.videoFiles.length || song.sheetMusic.length)">
            <div
                v-if="song.sheetMusic.length"
            >
                <p class="text-xs mb-2 tracking-wider uppercase opacity-50">
                    {{ $t("song_sheetmusic") }}
                </p>
                <MediaListItem :files="song.sheetMusic.filter(s => !s.type.endsWith('sibelius'))" :callback="selectSheetMusic" type="sheetmusic" />
            </div>
            <div
                v-if="song.audioFiles.length"
            >
                <p class="text-xs mb-2 tracking-wider uppercase opacity-50">
                    {{ $t('song_audioFiles') }}
                </p>
                <MediaListItem :files="song.audioFiles" :callback="selectAudio" type="audio" />
            </div>
            <div
                v-if="song.videoFiles.length"
            >
                <p class="text-xs mb-2 tracking-wider uppercase opacity-50">
                    {{ $t('song_videos') }}
                </p>
                <div class="flex flex-wrap gap-2">
                    <button
                        class="flex-grow flex items-center text-sm text-left p-2 rounded border border-gray-300 hover:border-gray-500 dark:border-gray-500 dark:hover:border-gray-400"
                        v-for="video in song.videoFiles"
                        :key="'video-' + video.id"
                        @click="setActiveVideo(video.directUrl)"
                    >
                        <PlayIcon class="w-4 h-4 mr-2 opacity-50 inline" />
                        <div class="flex-grow inline-flex gap-4 justify-between items-center">
                            <span>{{ $t(`types_${video.category}`) }}</span>
                            <span v-if="video.getInstrument()">{{ $t(`instrument_${video.getInstrument()?.identifier}`) }}</span>
                            <span v-if="video.languageKey" class="text-xs uppercase tracking-wider opacity-50 ml-auto">{{ video.languageKey }}</span>
                        </div>
                    </button>
                </div>
                <BaseModal
                    :show="showVideo"
                    @close="closeVideo"
                >
                    <button class="absolute top-1 right-1" @click="closeVideo">
                        <XIcon class="w-4 h-4" />
                    </button>
                    <video
                        :src="activeVideo"
                        width="500"
                        type="video/mp4"
                        controls
                        autoplay
                        fullscreen
                        controlsList="nodownload"
                    >
                        Sorry, your browser doesn't support embedded videos.
                    </video>
                </BaseModal>
            </div>
        </div>
        <p v-else class="text-sm opacity-50 text-center p-2">{{ $t('song_noFiles') }}</p>
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { BaseModal } from "@/components";
import { MediaListItem } from "@/components/media";
import { PlayIcon, XIcon } from "@heroicons/vue/solid";
import { Collection, Song } from "@/classes";
import { logs } from "@/services/logs";
import { SheetMusicOptions } from "songtreasures";
import { MediaFile } from "hiddentreasures-js";
import fileService from "@/services/songs/fileService";

export default defineComponent({
    name: "song-media-card",
    components: {
        BaseModal,
        MediaListItem,
        PlayIcon,
        XIcon,
    },
    props: {
        song: {
            type: Object as PropType<Song>,
            required: true,
        },
        collection: {
            type: Object as PropType<Collection>,
            required: true,
        },
    },
    emits: [
        "setSheetMusic",
        "setAudioTrack",
    ],
    data: () => ({
        showVideo: false,
        activeVideo: "",
        files: null as MediaFile[] | null,
    }),
    async mounted() {
        this.files = await fileService.childrenOf(this.song.id);
    },
    computed: {
        videoUrls() {
            return this.videoFiles.map(f => f.directUrl) ?? [];
        },
        videoFiles() {
            return this.files?.filter(i => i.type === "video") ?? [];
        },
        audioFiles() {
            return this.files?.filter(i => i.type === "audio") ?? [];
        },
        sheetMusic() {
            return this.files?.filter(i => i.type === "sheetmusic" || i.type === "sheetmusic-pdf") ?? [];
        },
    },
    methods: {
        openVideo() {
            this.showVideo = true;
        },
        closeVideo() {
            this.showVideo = false;
        },
        setActiveVideo(url: string) {
            this.activeVideo = url;
            this.openVideo();
        },
        selectSheetMusic(sheet: MediaFile) {
            const options: SheetMusicOptions = {
                show: true,
                fileId: sheet?.id,
                url: sheet?.directUrl,
                originalKey: this.song?.originalKey ?? "C",
                transposition: undefined,
                type: sheet?.type,
                clef: "treble",
            };

            logs.event("sheetmusic_view", {
                "file_id": sheet.id,
                "sheetmusic_transposition": 0,
                "song_id": this.song?.id,
            });

            this.$emit("setSheetMusic", options);
        },
        selectAudio(audio: MediaFile) {
            const track: AudioTrack = {
                file: audio,
                collection: this.collection,
            };
            this.$emit("setAudioTrack", track);
        },
    },
});
</script>
