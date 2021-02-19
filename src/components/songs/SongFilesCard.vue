<template>
    <base-card
        class="song-details__files"
        v-if="song && (song.audioFiles.length || song.videoFiles.length)"
        border
    >
        <div class="song-details__files__header">
            <h2 class="song-details__files__title">
                {{ $t("song.files") }}
            </h2>
            <base-button
                theme="secondary"
                :action="() => (filesIsOpen = !filesIsOpen)"
                icon="arrowDown"
            >
                <span>{{ $t("common.show") }}</span>
                <i class="fa fa-angle-down" v-if="!filesIsOpen"></i>
                <i class="fa fa-angle-up" v-else></i>
            </base-button>
        </div>
        <div class="files__container" v-show="filesIsOpen">
            <div
                class="song-details__files__audio"
                v-if="song.audioFiles.length"
            >
                <p class="song-details__files__label">Audio</p>
                <audio-playlist :audiofiles="song.audioFiles"></audio-playlist>
            </div>
            <div
                class="song-details__files__video"
                v-if="song.videoFiles.length"
            >
                <p class="song-details__files__label">Video</p>
                <modal
                    v-for="video in song.videoFiles"
                    theme="secondary"
                    :key="video"
                    :label="video.name"
                >
                    <video
                        :src="video.directUrl"
                        width="500"
                        type="video/mp4"
                        controls
                    >
                        Sorry, your browser doesn't support embedded videos.
                    </video>
                </modal>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { BaseCard, Modal, BaseButton } from "@/components";
import { AudioPlaylist } from "@/components/media";
import { Song } from "@/classes";
import { Options, Vue } from "vue-class-component";

@Options({
    components: {
        BaseCard,
        Modal,
        BaseButton,
        AudioPlaylist,
    },
    props: {
        song: {
            type: Object,
        },
    },
})
export default class SongFilesCard extends Vue {
    public song?: Song;
    public filesIsOpen = false;
}
</script>
<style lang="scss">
.song-details {
    &__files {
        flex-shrink: 0;

        &__label {
            opacity: 0.7;
            margin: 0 0 0.3em 0;
        }

        &__title {
            margin: 0;
        }

        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card__content {
            .files__container {
                display: flex;
                flex-direction: column;
                gap: var(--st-spacing);
                margin-top: var(--st-spacing);
            }
        }

        figure {
            margin: 0 0 0.5em 0;
        }
    }
}
</style>