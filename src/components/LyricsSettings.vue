<template>
    <div class="lyrics-settings" v-if="song">
        <base-card class="lyrics-settings__metadata" border secondary>
            <h2 class="lyrics-settings__metadata__title"><span style="opacity: .5; padding-right: .5em">{{song.number}}</span> {{title}}</h2>
            <span v-if="song.type == 'lyrics'" class="lyrics-settings__metadata__verse-count tag">{{Object.keys(verses).length}} verses</span>
            <p class="lyrics-settings__metadata__credits">
                Author: 
                <span v-for="author in authors" :key="author.id">
                    <span v-if="!author.getBiography(languageKey)">{{ author.name }}</span>
                    <modal :label="author.name" v-else>
                        <div v-html="author.getBiography(languageKey)" class="biography-wrapper"></div>
                    </modal>
                </span>
            </p>
            <p v-if="composers.length > 0" class="lyrics-settings__metadata__credits">
                Composer: 
                <span v-for="composer in composers" :key="composer.id" :label="composer.name">
                    <span v-if="!composer.getBiography(languageKey)">{{ composer.name }}</span>
                    <modal :label="composer.name" v-else>
                        <div v-html="composer.getBiography(languageKey)" class="biography-wrapper"></div>
                    </modal>
                </span>
            </p>
            <p class="lyrics-settings__metadata__credits" v-if="melodyOrigin">{{melodyOrigin}}</p> 
            <div v-if="description" v-html="description"></div>
        </base-card>
        <base-card v-if="song.type == 'lyrics'" class="lyrics-settings__controls" border>
            <h2 class="lyrics-settings__controls__title">Controls</h2>
            <button class="lyrics-settings__controls__open" @click="openLyricsWindow('lyrics')">Open viewer</button>
            <button class="lyrics-settings__controls__update" @click="updateLyrics">Update viewer</button>
            <button class="lyrcis-settings__controls__previous" @click="previous" secondary>Previous</button>
            <button class="lyrcis-settings__controls__next" @click="next" secondary>Next</button>
            <br/>
            <button class="lyrics-settings__controls__open" @click="openLyricsWindow('karaoke')">Open KaraokeViewer</button>
            <button @click="setLineSize(1)">1</button>
            <button @click="setLineSize(2)">2</button>
        </base-card>
        <base-card v-if="song.type == 'lyrics'" class="lyrics-settings__verses" border>
            <h2 class="lyrics-settings__verses__title">Verses</h2>
            <label class="lyrics-settings__verses__input" :class="{'selected': selected.includes(key)}" v-for="key in Object.keys(verses)" :key="key">
                <input :id="key" type="checkbox" class="lyrics-settings__verses__input__check" checked @click="toggleVerse(key)">
                <span :for="key" class="lyrics-settings__verses__input__label">{{ verses[key].name }}</span>
            </label>
        </base-card>
        <base-card class="lyrics-settings__files" v-if="song.audioFiles.length || song.videoFiles.length" border>
            <h2 class="lyrics-settings__files__title">Files</h2>
            <div class="files__container">
                <base-card class="lyrics-settings__files__audio" v-if="song.audioFiles.length">
                    <h3>Audio</h3>
                    <figure v-for="file in song.audioFiles" :key="file">
                        <figcaption>{{file.name}}</figcaption>
                        <audio :src="file.directUrl" controls>
                            Your browser does not support the <code>audio</code> element.
                        </audio>
                    </figure>
                </base-card>
                <base-card class="lyrics-settings__files__video" v-if="song.videoFiles.length">
                    <h3>Video</h3>
                    <modal v-for="video in song.videoFiles" :key="video" :label="video.name">
                        <video :src="video.directUrl" width="500" type="video/mp4" controls>
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
import { Lyrics, Song } from "@/classes";
import BaseCard from  '@/components/BaseCard.vue';
import Modal from '@/components/Modal.vue';
import ContributorItem from "@/classes/contributor";

@Options({
    components: {
        BaseCard,
        Modal,
    },
    props: {
        title: {
            type: String,
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
        },
        authors: {
            type: Array,
        },
        composers: {
            type: Array,
        }
    }
})
export default class LyricsSettings extends Vue {
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    public currentLinesNumber = 0;
    public description = '';
    public lyrics?: Lyrics;
    public languageKey = '';
    public song?: Song;
    public composers: ContributorItem[] = [];
    public authors: ContributorItem[] = [];
    public title = '';

    public lineSize = 2;

    // public toggleVerse(key: string) {
    // }

    public async mounted() {
        this.selectVerses = Object.assign([], Object.keys(this.verses) ?? []);
        window.addEventListener('keydown', (event) => {
            if (event.key == "ArrowRight") {
                this.next();
            }
            if (event.key == "ArrowLeft") {
                this.previous();
            }
        });

        window.addEventListener('storage', (event) => {
            if (event.key == 'lyrics_next') {
                this.next();
            }
            if (event.key == 'lyrics_previous') {
                this.previous();
            }
        });
    }

    public setLineSize(number: number) {
        this.lineSize = number;
        localStorage.setItem('lyrics_lines', JSON.stringify(this.currentLines));
    }

    public openLyricsWindow(type: string){
        this.updateLyrics();
        window.open('/' + type, 'Lyrics Viewer', 'resizeable,scrollbars')
    }

    public toggleVerse(key: string) {
        if(this.selectVerses.includes(key)) {
            this.selectVerses = this.selectVerses.filter(k => k != key);
        } else {
            this.selectVerses.push(key);
        }
    }

    public updateLyrics() {
        // if (this.size == 1) {
        //     this.currentVerses = [1];
        // }
        // if (this.size == 2) {
        //     this.currentVerses = [1, 2];
        // }

        localStorage.setItem('lyrics', JSON.stringify(this.current));
        localStorage.setItem('song', JSON.stringify(this.song));
        localStorage.setItem('lyrics_lines', JSON.stringify(this.currentLines))
    }

    public next() {
        if (this.size == 2) {
            this.currentVerseNumber = this.currentVerseNumber + 2;
        } else {
            this.currentVerseNumber++;
        }
        this.currentLinesNumber = this.currentLinesNumber + this.lineSize;
        localStorage.setItem('lyrics', JSON.stringify(this.current));
        localStorage.setItem('lyrics_lines', JSON.stringify(this.currentLines));
    }

    public previous() {
        if (this.currentVerseNumber !== 0) {
            if (this.size == 2) {
                this.currentVerseNumber = this.currentVerseNumber - 2;
            } else {
                this.currentVerseNumber--;
            }
        }
        if (this.currentLinesNumber !== 0) {
            this.currentLinesNumber = this.currentLinesNumber - this.lineSize;
        }
        localStorage.setItem('lyrics', JSON.stringify(this.current));
        localStorage.setItem('lyrics_lines', JSON.stringify(this.currentLines));
    }

    public get selected() {
        return this.selectVerses?.sort((a, b) => parseInt(a) - parseInt(b)) ?? [];
    }

    public get verses() {
        return this.lyrics?.verses ?? {};
    }

    public get size() {
        return this.verses[1].content.length <= 5 ? 2 : 1;
    }

    public get melodyOrigin() {
        return this.song?.melodyOrigin?.name[this.languageKey] ?? this.song?.melodyOrigin?.name.no ?? undefined;
    }

    public get currentVerses(): string[] {
        const keys = [];
        if (this.size == 1) {
            if (this.selected[this.currentVerseNumber]) keys.push(this.selected[this.currentVerseNumber]);
        } else if (this.size == 2) {
            if (this.selected[this.currentVerseNumber]) keys.push(this.selected[this.currentVerseNumber]);
            if (this.selected[this.currentVerseNumber + 1]) keys.push(this.selected[this.currentVerseNumber + 1]);
        }
        return keys;
    }

    public get currentLines(): string[] {
        const lines = this.lyrics?.lines ?? [];

        return lines.slice(this.currentLinesNumber, this.currentLinesNumber + this.lineSize) ?? []
    }

    public get current() {
        const verses: Verse[] = [];

        for (const key of this.currentVerses) {
            if (this.verses[key]) verses.push(this.verses[key])
        }

        return verses;
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

.lyrics-settings {
    --half-spacing: calc(var(--st-spacing) * 0.5);

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--st-spacing);

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
                gap: var(--st-spacing);
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
            gap: var(--st-spacing);
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
                margin-bottom: .5em;
            }
        }
    }
}
</style>