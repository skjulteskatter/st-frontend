<template>
    <div class="song-details" v-if="song">
        <card class="song-details__metadata" border secondary>
            <h2 class="song-details__metadata__title"><span style="opacity: .5; padding-right: .5em">{{song.number}}</span> {{title}}</h2>
            <p class="song-details__metadata__credits">
                <span>Author: </span>
                <span v-for="author in authors" :key="author.id">
                    <span v-if="!author.getBiography(languageKey)">{{ author.name }}</span>
                    <modal :label="author.name" type="span" v-else>
                        <div v-html="author.getBiography(languageKey)" class="biography-wrapper"></div>
                    </modal>
                </span>
            </p>
            <p v-if="composers.length > 0" class="song-details__metadata__credits">
                <span>Composer: </span>
                <span v-for="composer in composers" :key="composer.id" :label="composer.name">
                    <span v-if="!composer.getBiography(languageKey)">{{ composer.name }}</span>
                    <modal :label="composer.name" type="span" v-else>
                        <div v-html="composer.getBiography(languageKey)" class="biography-wrapper"></div>
                    </modal>
                </span>
            </p>
            <p class="lyrics-settings__metadata__credits" v-if="melodyOrigin">{{melodyOrigin}}</p> 
            <div v-if="description" v-html="description"></div>
        </card>
        <card class="song-details__files" v-if="song.audioFiles.length || song.videoFiles.length" border>
            <h2 class="song-details__files__title">Files</h2>
            <div class="files__container">
                <card class="song-details__files__audio" v-if="song.audioFiles.length">
                    <h3>Audio</h3>
                    <figure v-for="file in song.audioFiles" :key="file">
                        <figcaption>{{file.name}}</figcaption>
                        <audio :src="file.directUrl" controls>
                            Your browser does not support the <code>audio</code> element.
                        </audio>
                    </figure>
                </card>
                <card class="song-details__files__video" v-if="song.videoFiles.length">
                    <h3>Video</h3>
                    <modal v-for="video in song.videoFiles" :key="video" :label="video.name">
                        <video :src="video.directUrl" width="500" type="video/mp4" controls>
                            Sorry, your browser doesn't support embedded videos.
                        </video>
                    </modal>
                </card>
            </div>
        </card>
        <card class="song-details__lyrics">
            <div v-for="verse in text" :key="verse.name + verse.content">
                <b>{{verse.name}}</b>
                <p v-for="line in verse.content" :key="line">{{line}}</p>
            </div>
        </card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from  '@/components/BaseCard.vue';
import Modal from '@/components/Modal.vue';
import { Lyrics, Song } from "@/classes";

@Options({
    components: {
        BaseCard,
        Modal,
    },
    props: {
        title: {
            type: String,
            default: () => '',
        },
        description: {
            type: String,
            default: () => '',
        },
        lyrics: {
            type: Object,
            default: () => undefined,
        },
        languageKey: {
            type: String,
            default: () => '',
        },
        song: {
            type: Object,
            default: () => undefined,
        },
        composers: {
            type: Array,
            default: () => [],
        },
        authors: {
            type: Array,
            default: () => [],
        }
    }
})
export default class SongDetails extends Vue {
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    public description = '';
    public lyrics?: Lyrics;
    public languageKey = '';
    public song?: Song;

    // public async mounted() {
    //     const songDetailsElement = document.getElementById("song-details");

    //     if (songDetailsElement) {
    //         songDetailsElement.innerHTML = this.description;
    //     }
    // }

    public get text() {
        const verses: { name: string; content: string[] }[] = [];

        const types: {
            [key: string]: string;
        } = {
            '[Chorus]': 'chorus',
            '[Bridge]': 'bridge',
        }
        
        if (this.lyrics) {
            for (const key of Object.keys(this.lyrics.content)) {


                const verse: Verse = {
                    name: (this.lyrics.content as JsonContent)[key].name,
                    content: (this.lyrics.content as JsonContent)[key].content,
                    type: types[(this.lyrics.content as JsonContent)[key].name] ?? 'verse',
                }

                verses.push(verse);
            }
        }

        return verses;
    }

    public get melodyOrigin() {
        return this.song?.melodyOrigin?.name[this.languageKey] ?? this.song?.melodyOrigin?.name.no ?? undefined;
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
        width: 100%;
    }
}

.song-details {
    --half-spacing: calc(var(--st-spacing) * 0.5);

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--st-spacing);

    &__lyrics {
        grid-column: span 4;
    }

    &__files {
        grid-column: span 2;

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
                gap: var(--st-spacing);
            }
        }

        figure {
            margin: 0 0 .5em 0;
        }
    }

    &__metadata {
        grid-column: span 6;

        &__credits {
            display: inline-block;
            color: var(--st-primary-color);

            span {
                display: inline-block;
                margin-right: var(--half-spacing);
            }
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
}
</style>