<template>
    <div class="lyrics-settings">
        <card class="lyrics-settings__metadata" border secondary>
            <h2 class="lyrics-settings__metadata__title">{{song.name[languageKey].title}}</h2>
            <p class="lyrics-settings__metadata__credits">Author: <span v-for="author in authors" :key="author.id"> {{ author.name }} </span></p>
            <p v-if="composers.length > 0" class="lyrics-settings__metadata__credits">Composer: <span v-for="composer in composers" :key="composer.id"> {{ composer.name }} </span></p>
            <div v-if="biography" id="biography"></div>
            <div v-if="biography && description">------------------------</div>
            <div v-if="description" id="song-details"></div>
        </card>
        <card class="lyrics-settings__files" v-if="song.soundFiles.length || song.videoFiles.length">
            <h2 class="lyrics-settings__files__title">Files</h2>
            <div class="files__container">
                <card class="lyrics-settings__files__audio" v-if="song.soundFiles.length">
                    <h3>Audio</h3>
                    <figure v-for="file in song.soundFiles" :key="file">
                        <figcaption>{{file.name}}</figcaption>
                        <audio :src="file.directUrl" controls>
                            Your browser does not support the <code>audio</code> element.
                        </audio>
                    </figure>
                </card>
                <card class="lyrics-settings__files__video" v-if="song.videoFiles.length">
                    <h3>Video</h3>
                    <modal v-for="video in song.videoFiles" :key="video" :label="video.name">
                        <video :src="video.directUrl" width="500" type="video/mp4" controls>
                            Sorry, your browser doesn't support embedded videos.
                        </video>
                    </modal>
                    <!-- <a class="lyrics-settings__files__video__link" v-for="video in song.videoFiles" :href="video.directUrl" target="_blank" :key="video">{{video.name}}</a> -->
                </card>
            </div>
        </card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics, Song } from '@/classes';
import { useStore } from 'vuex';
import { sessionKey, songKey } from '@/store';
import Card from  '@/components/Card.vue';
import Modal from '@/components/Modal.vue';

@Options({
    props: {
        lyrics: {
            type: Object,
            default: {}
        },
        song: {
            type: Object,
            default: {}
        }
    },
    components: {
        Card,
        Modal,
    }
})
export default class LyricsSettings extends Vue {
    public lyrics: Lyrics = {} as Lyrics;
    public selectVerses: string[] = [];
    public song: Song = useStore(songKey).getters.song;
    public currentVerseNumber = 0;

    // public toggleVerse(key: string) {
    // 

    public get authors() {
        return this.song.authors ?? [];
    }

    public get title() {
        return this.song.name[this.languageKey]?.title ?? this.song.name.no.title ?? this.song.name.en.title;
    }

    public get composers() {
        return this.song.composers ?? [];
    }

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey;
    }

    public get description() {
        return this.song.description[this.languageKey] ?? this.song.description.no ?? '';
    }

    public get biography() {
        return this.authors[0]?.getBiography(this.languageKey) ?? '';
    }
}
</script>

<style lang="scss">
#biography img {
    max-width: 100%;
}

.lyrics-settings {
    --half-spacing: calc(var(--spacing) * 0.5);

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--spacing);

    &__files {
        grid-column: span 5;

        &__video {
            &__link {
                text-decoration: none;
                color: var(--primary-color);
            }
        }

        .card__content {
            .files__container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: var(--spacing);
            }
        }

        figure {
            margin: 0 0 .5em 0;
        }
    }

    &__metadata {
        grid-column: span 4;

        &__credits {
            display: inline-block;
            margin: 0 0 0 var(--spacing);
            color: var(--primary-color);
        }

        .card__content {
            h2 {
                margin: 0 0 var(--spacing);
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
            gap: var(--spacing);
        }

        &__title {
            margin: 0;
            grid-column: span 2;
        }

        &__update {
            font-size: 1em;
            padding: var(--spacing);
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
            border-radius: var(--border-radius);
            overflow: hidden;
            font-size: 1.1em;
            
            display: flex;
            align-items: center;

            &__check {
                display: none;

                &:checked + span {
                    color: white;
                    background: var(--primary-color);
                }
            }

            &__label {
                width: 100%;
                padding: var(--half-spacing);
                background: var(--secondary-background-color);
                color: var(--text-color);
                user-select: none;
            }

            &:not(:last-child) {
                margin-bottom: .5em;
            }
        }
    }
}
</style>