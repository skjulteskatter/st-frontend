<template>
    <div class="song-details" v-if="song">
        <card class="song-details__metadata" border secondary>
            <h2 class="song-details__metadata__title"><span style="opacity: .5; padding-right: .5em">{{song.number}}</span> {{title}}</h2>
            <p class="song-details__metadata__credits">
                Author: 
                <span v-for="author in authors" :key="author.id">
                    <span v-if="!biography">{{ author.name }}</span>
                    <modal :label="author.name" v-else>
                        <div v-html="biography" class="biography-wrapper"></div>
                    </modal>
                </span>
            </p>
            <p v-if="composers.length > 0" class="song-details__metadata__credits">
                Composer: 
                <span v-for="composer in composers" :key="composer.id" :label="composer.name">
                    <span v-if="!description">{{ composer.name }}</span>
                    <modal :label="composer.name" v-else>
                        <div v-html="description" class="biography-wrapper"></div>
                    </modal>
                </span>
            </p>
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
                    <!-- <a class="song-details__files__video__link" v-for="video in song.videoFiles" :href="video.directUrl" target="_blank" :key="video">{{video.name}}</a> -->
                </card>
            </div>
        </card>
        <div>
            <div v-for="verse in text" :key="verse.name + verse.content">
                <h3>{{verse.name}}</h3>
                <p v-for="line in verse.content" :key="line">{{line}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from 'vuex';
import { sessionKey, songKey } from '@/store';
import Card from  '@/components/Card.vue';
import Modal from '@/components/Modal.vue';
import { Lyrics, Song } from "@/classes";

@Options({
    components: {
        Card,
        Modal,
    }
})
export default class SongDetails extends Vue {
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    private store = useStore(songKey);

    // public toggleVerse(key: string) {
    // }

    public async mounted() {
        if (!this.lyrics) {
            await this.store.dispatch('load', {
                collectionKey: this.$route.params.collection, 
                number: this.$route.params.number,
                languageKey: this.languageKey,
            });
        }

        const songDetailsElement = document.getElementById("song-details");

        if (songDetailsElement) {
            songDetailsElement.innerHTML = this.description;
        }

        const biographyElement = document.getElementById('biography');

        if (biographyElement) {
            biographyElement.innerHTML = this.biography;
        }
    }

    public get title() {
        return this.song.name[this.languageKey] ?? this.song.name.en ?? this.song.name.no ?? '';
    }

    public get description() {
        return this.song.description[this.languageKey] ?? this.song.description.en ?? this.song.description.no ?? '';
    }

    public get biography() {
        return this.authors[0]?.getBiography(this.languageKey) ?? '';
    }

    public get authors() {
        return this.song.authors ?? [];
    }

    public get text() {
        const verses: { name: string; content: string[] }[] = [];

        const types: {
            [key: string]: string;
        } = {
            '[Chorus]': 'chorus',
            '[Bridge]': 'bridge',
        }
        
        for (const key of Object.keys(this.lyrics.content)) {


            const verse: Verse = {
                name: this.lyrics.content[key].name,
                content: this.lyrics.content[key].content,
                type: types[this.lyrics.content[key].name] ?? 'verse',
            }

            verses.push(verse);
        }

        return verses;
    }

    public get composers() {
        return this.song.composers ?? [];
    }

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey;
    }
    
    public get lyrics(): Lyrics {
        return this.store.getters.lyrics;
    }
    public get song(): Song {
        return this.store.getters.song;
    }
}
</script>

<style lang="scss">

#biography img {
    max-width: 100%;
}

.biography-wrapper {
    color: var(--text-color);

    img {
        max-width: 50%;
    }
}

.song-details {
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