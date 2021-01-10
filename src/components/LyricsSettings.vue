<template>
    <div class="lyrics-settings">
        <card class="lyrics-settings__verses">
            <h2 class="lyrics-settings__verses__title">Verses</h2>
            <label class="lyrics-settings__verses__input" :class="{'selected': selected.includes(key)}" v-for="key in Object.keys(verses)" :key="key">
                <input :id="key" type="checkbox" class="lyrics-settings__verses__input__check" checked @click="toggleVerse(key)">
                <span :for="key" class="lyrics-settings__verses__input__label">{{ verses[key].name }}</span>
            </label>
        </card>
        <card class="lyrics-settings__controls" border>
            <h2 class="lyrics-settings__controls__title">Controls</h2>
            <button class="lyrics-settings__controls__open" @click="openLyricsWindow">Open viewer</button>
            <button class="lyrics-settings__controls__update" @click="updateLyrics">Update viewer</button>
            <button class="lyrcis-settings__controls__previous" @click="previous" secondary>Previous</button>
            <button class="lyrcis-settings__controls__next" @click="next" secondary>Next</button>
        </card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics } from '@/classes';
import { useStore } from 'vuex';
import { songKey } from '@/store';
import Card from  '@/components/Card.vue';

@Options({
    props: {
        lyrics: {
            type: Object,
            default: {}
        }
    },
    components: {
        Card
    }
})
export default class LyricsSettings extends Vue {
    public lyrics: Lyrics = {} as Lyrics;
    public selectVerses: string[] = [];
    public song = useStore(songKey).getters.song;
    public currentVerseNumber = 0;

    // public toggleVerse(key: string) {
    // }

    public mounted() {
        this.selectVerses = Object.assign([], Object.keys(this.verses) ?? []);
    }

    public openLyricsWindow(){
        this.updateLyrics();
        window.open('/lyrics', 'Lyrics Viewer', 'resizeable,scrollbars')
    }

    public toggleVerse(key: string) {
        if(this.selectVerses.includes(key)) {
            this.selectVerses = this.selectVerses.filter(k => k != key);
        } else {
            this.selectVerses.push(key);
        }
        console.log(this.selected);
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
    }

    public next() {
        if (this.size == 2) {
            this.currentVerseNumber = this.currentVerseNumber + 2;
        } else {
            this.currentVerseNumber++;
        }
        localStorage.setItem('lyrics', JSON.stringify(this.current));
    }

    public get selected() {
        return this.selectVerses?.sort((a, b) => parseInt(a) - parseInt(b)) ?? [];
    }

    public get verses() {
        return this.lyrics.verses;
    }

    public get size() {
        return this.verses[1].content.length <= 6 ? 2 : 1;
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
.lyrics-settings {
    --half-spacing: calc(var(--spacing) * 0.5);

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing);

    &__controls {

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

                background: #eaeaea;
                color: var(--text-color);
                user-select: none;

                // &.selected {
                //     background: var(--primary-color);
                // }
            }

            &:not(:last-child) {
                margin-bottom: .5em;
            }
        }
    }
}
</style>