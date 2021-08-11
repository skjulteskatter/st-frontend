<template>
    <base-card
        v-if="song && (song.audioFiles.length || song.videoFiles.length || song.sheetMusic.length)"
        header
    >
        <template #header>
            <div class="flex items-center gap-4">
                <h4 class="font-bold">
                    {{ $t("song.media") }}
                </h4>
                <tooltip :text="$t('tooltip.songFiles')" />
            </div>
        </template>
        <div class="flex flex-col gap-4">
            <div
                v-if="song.sheetMusic.length"
            >
                <p class="text-sm mb-2">
                    {{ $t("song.sheetmusic") }}
                </p>
                <media-list-item :files="song.sheetMusic.filter(s => !s.type.endsWith('sibelius'))" :callback="selectSheetMusic" type="sheetmusic" />
            </div>
            <div
                v-if="song.audioFiles.length"
            >
                <p class="text-sm mb-2">
                    {{ $t('song.audioFiles') }}
                </p>
                <media-list-item :files="song.audioFiles" :callback="selectAudio" type="audio" />
            </div>
            <div
                v-if="song.videoFiles.length"
            >
                <p class="text-sm mb-2">
                    {{ $t('song.videos') }}
                </p>
                <div class="flex flex-wrap gap-2">
                    <button
                        class="flex-grow text-sm text-left p-2 rounded border border-gray-300 hover:border-gray-500 dark:border-gray-500 dark:hover:border-gray-400"
                        v-for="video in song.videoFiles"
                        :key="'video-' + video.id"
                        @click="setActiveVideo(video.directUrl)"
                    >
                        <PlayIcon class="w-4 h-4 mr-2 opacity-50 inline" />
                        <span>{{ $t(`types.${video.category}`) + (video.languageKey ? ` (${video.languageKey})` : '') }}</span>
                    </button>
                </div>
                <base-modal
                    :show="showVideo"
                    @close="closeVideo"
                >
                    <video
                        :src="activeVideo"
                        width="500"
                        type="video/mp4"
                        controls
                        autoplay
                        fullscreen
                    >
                        Sorry, your browser doesn't support embedded videos.
                    </video>
                </base-modal>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { BaseModal } from "@/components";
import { MediaListItem } from "@/components/media";
import { PlayIcon } from "@heroicons/vue/solid";
import { Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { MediaFile } from "dmb-api";
import { useStore } from "@/store";
import { AudioTrack } from "@/store/modules/songs/state";
import { logs } from "@/services/logs";

@Options({
    components: {
        BaseModal,
        MediaListItem,
        PlayIcon,
    },
    props: {
        song: {
            type: Object,
        },
    },
    name: "song-media-card",
})
export default class SongMediaCard extends Vue {
    public song?: Song;
    public store = useStore();
    public showVideo = false;
    public activeVideo = "";

    public openVideo() {
        this.showVideo = true;
    }

    public closeVideo() {
        this.showVideo = false;
    }

    public setActiveVideo(url: string) {
        this.activeVideo = url;
        this.openVideo();
    }

    public selectSheetMusic(sheet: MediaFile) {
        const options: SheetMusicOptions = {
            show: true,
            url: sheet?.directUrl,
            originalKey: this.song?.originalKey ?? "C",
            transposition: this.transposition,
            type: sheet?.type,
            clef: "treble",
        };

        logs.event("sheetmusic_view", {
            "file_id": sheet.id,
            "sheetmusic_transposition": 0,
            "song_id": this.song?.id,
        });

        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, options);
    }

    public get videoUrls() {
        return this.song?.videoFiles.map(f => f.directUrl) ?? [];
    }

    public get transposition() {
        return this.store.state.songs.transposition;
    }

    public selectAudio(audio: MediaFile) {
        const track: AudioTrack = {
            file: audio,
            collection: this.store.getters.collection,
        };
        this.store.commit(SongsMutationTypes.SET_AUDIO, track);
    }
}
</script>
