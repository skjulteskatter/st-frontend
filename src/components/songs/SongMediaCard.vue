<template>
    <base-card
        v-if="song && (song.audioFiles.length || song.videoFiles.length || song.sheetMusic.length)"
        header
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h4 class="font-bold">
                    {{ $t("song.media") }}
                </h4>
            </div>
        </template>
        <div class="flex flex-col gap-4">
            <div
                v-if="song.sheetMusic.length"
            >
                <p class="text-sm mb-2">
                    {{ $t("song.sheetmusic") }}
                </p>
                <sheetmusic-playlist :sheetmusic="song.sheetMusic" />
            </div>
            <div
                v-if="song.audioFiles.length"
            >
                <p class="text-sm mb-2">
                    Audio
                </p>
                <audio-playlist :audiofiles="song.audioFiles" />
            </div>
            <div
                v-if="song.videoFiles.length"
            >
                <p class="text-sm mb-2">
                    Video
                </p>
                <modal
                    v-for="video in song.videoFiles"
                    theme="tertiary"
                    :key="video"
                    :label="$t(`types.${video.category}`) + (video.languageKey ? ` (${video.languageKey})` : '')"
                >
                    <video
                        :src="video.directUrl"
                        width="500"
                        type="video/mp4"
                        controls
                        autoplay
                    >
                        Sorry, your browser doesn't support embedded videos.
                    </video>
                </modal>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { BaseCard, Modal } from "@/components";
import { AudioPlaylist, SheetmusicPlaylist } from "@/components/media";
import { Song } from "@/classes";
import { Options, Vue } from "vue-class-component";

@Options({
    components: {
        BaseCard,
        Modal,
        AudioPlaylist,
        SheetmusicPlaylist,
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
}
</script>
