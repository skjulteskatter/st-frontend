<template>
    <div class="song-details" v-if="song">
        <!-- <base-card class="song-details__metadata" border secondary>
            <h2 class="song-details__metadata__title">
                <span style="opacity: 0.5; padding-right: 0.5em">{{
                    song.number
                }}</span>
                {{ title }}
            </h2>
            <p class="song-details__metadata__credits">
                Author:
                <span v-for="author in song.authors" :key="author.id">
                    <span v-if="!author.getBiography(languageKey)">{{
                        author.name
                    }}</span>
                    <modal :label="author.name" v-else>
                        <div
                            v-html="author.getBiography(languageKey)"
                            class="biography-wrapper"
                        ></div>
                    </modal>
                </span>
            </p>
            <p
                v-if="song.composers.length > 0"
                class="song-details__metadata__credits"
            >
                Composer:
                <span
                    v-for="composer in song.composers"
                    :key="composer.id"
                    :label="composer.name"
                >
                    <span v-if="!composer.getBiography(languageKey)">{{
                        composer.name
                    }}</span>
                    <modal :label="composer.name" v-else>
                        <div
                            v-html="composer.getBiography(languageKey)"
                            class="biography-wrapper"
                        ></div>
                    </modal>
                </span>
            </p>
            <p class="lyrics-settings__metadata__credits" v-if="melodyOrigin">
                {{ melodyOrigin }}
            </p>
        </base-card> -->
        <base-card v-if="lyrics && lyrics.format == 'html'" border>
            <div v-html="lyrics.transposed"></div>
        </base-card>
        <base-card
            class="song-details__files"
            v-if="song.audioFiles.length || song.videoFiles.length"
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
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from "@/components/BaseCard.vue";
import Modal from "@/components/Modal.vue";
import { Song } from "@/classes";
import { useStore } from "vuex";
import { songKey } from "@/store";

@Options({
    components: {
        BaseCard,
        Modal,
    },
    props: {
        languageKey: {
            type: String,
        },
        song: {
            type: Object,
        },
    },
})
export default class TransposedLyricsViewer extends Vue {
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    public description = "";
    public languageKey = "";
    public title = "";
    public song?: Song;

    private songStore = useStore(songKey);

    public get melodyOrigin() {
        return (
            this.song?.melodyOrigin?.name[this.languageKey] ??
            this.song?.melodyOrigin?.name.no ??
            undefined
        );
    }

    public get lyrics() {
        return this.songStore.state.lyrics;
    }
}
</script>

<style lang="scss">
#biography img {
    max-width: 100%;
}

.biography-wrapper {
    color: var(--st-text-color);

    img {
        max-width: 50%;
    }
}

.song-details {
    --half-spacing: calc(var(--st-spacing) * 0.5);

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: var(--st-spacing);

    &__files {
        grid-column: span 5;

        &__video {
            &__link {
                text-decoration: none;
                color: var(--st-primary-color);
            }
        }

        .card__content {
            .files__container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-gap: var(--st-spacing);
            }
        }

        figure {
            margin: 0 0 0.5em 0;
        }
    }

    &__metadata {
        grid-column: span 4;

        &__credits {
            display: inline-block;
            margin: 0 0 0 var(--st-spacing);
            color: var(--st-primary-color);
        }

        .card__content {
            h2 {
                margin: 0 0 var(--st-spacing);
            }

            .tag {
                display: inline-block;
                margin: 0;
            }
        }
    }

    &__controls {
        grid-column: span 2;

        .card__content {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: var(--st-spacing);
        }

        &__title {
            margin: 0;
            grid-column: span 2;
        }

        &__update {
            font-size: 1em;
            padding: var(--st-spacing);
        }

        &__open {
            font-size: 1em;
        }
    }

    &__verses {
        display: flex;

        &__title {
            margin-top: 0;
        }

        &__input {
            border-radius: var(--st-border-radius);
            overflow: hidden;
            font-size: 1.1em;

            display: flex;
            align-items: center;

            &__check {
                display: none;

                &:checked + span {
                    color: white;
                    background: var(--st-primary-color);
                }
            }

            &__label {
                width: 100%;
                padding: var(--half-spacing);
                background: var(--st-secondary-background-color);
                color: var(--st-text-color);
                user-select: none;
            }

            &:not(:last-child) {
                margin-bottom: 0.5em;
            }
        }
    }
}
</style>