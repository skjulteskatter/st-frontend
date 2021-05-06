<template>
    <base-card
        class="song-details__files"
        v-if="song && (song.audioFiles.length || song.videoFiles.length || song.sheetMusic.length)"
        header
    >
        <template #header>
            <div class="song-details__files__header">
                <h4 class="song-details__files__title">
                    {{ $t("song.media") }}
                </h4>
            </div>
        </template>
        <div class="song-details__files__container">
            <div
                class="song-details__files__sheetmusic"
                v-if="song.sheetMusic.length"
            >
                <p class="song-details__files__label">
                    <icon name="book" size="16" />
                    {{ $t("song.sheetmusic") }}
                </p>
                <sheetmusic-playlist :sheetmusic="song.sheetMusic" />
            </div>
            <div
                class="song-details__files__audio"
                v-if="song.audioFiles.length"
            >
                <p class="song-details__files__label">
                    <icon name="music" size="16" />
                    Audio
                </p>
                <audio-playlist :audiofiles="song.audioFiles" />
            </div>
            <div
                class="song-details__files__video"
                v-if="song.videoFiles.length"
            >
                <p class="song-details__files__label">
                    <icon name="play" size="16" />
                    Video
                </p>
                <modal
                    v-for="video in song.videoFiles"
                    theme="tertiary"
                    :key="video"
                    :label="$t(`types.${video.category}`)"
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
import { Icon } from "@/components/icon";
import { Song } from "@/classes";
import { Options, Vue } from "vue-class-component";

@Options({
    components: {
        BaseCard,
        Modal,
        AudioPlaylist,
        SheetmusicPlaylist,
        Icon,
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
<style lang="scss">
.song-details {
    &__files {
        min-width: 150px;

        &__label {
            opacity: 0.7;
            margin: 0 0 0.3em 0;
            display: flex;
            align-items: center;
            gap: calc(var(--st-spacing) / 2);
        }

        &__title {
            margin: 0;
        }

        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        &__container {
            display: flex;
            flex-direction: column;
            gap: var(--st-spacing);
        }
    }
}
</style>
