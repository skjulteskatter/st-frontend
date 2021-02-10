<template>
    <base-card
        class="song-details__files"
        v-if="song && (song.audioFiles.length || song.videoFiles.length)"
        border
    >
        <h2 class="song-details__files__title">Files</h2>
        <div class="files__container">
            <base-card
                class="song-details__files__audio"
                v-if="song.audioFiles.length"
            >
                <h3>Audio</h3>
                <figure v-for="file in song.audioFiles" :key="file">
                    <figcaption>{{ file.name }}</figcaption>
                    <audio :src="file.directUrl" controls>
                        Your browser does not support the
                        <code>audio</code> element.
                    </audio>
                </figure>
            </base-card>
            <base-card
                class="song-details__files__video"
                v-if="song.videoFiles.length"
            >
                <h3>Video</h3>
                <modal
                    v-for="video in song.videoFiles"
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
            </base-card>
        </div>
    </base-card>
</template>

<script lang="ts">
import { BaseCard, Modal } from "@/components";
import { Song } from "@/classes";
import { Options, Vue } from "vue-class-component";

@Options({
    components: {
        BaseCard,
        Modal,
    },
    props: {
        song: {
            type: Object,
        },
    },
})
export default class SongFilesCard extends Vue {
    public song?: Song;
}
</script>
<style lang="scss">
.song-details {
    &__files {
        grid-column: span 2;

        .card__content {
            .files__container {
                display: flex;
                flex-direction: column;
            }
        }

        figure {
            margin: 0 0 0.5em 0;
        }
    }
}
</style>