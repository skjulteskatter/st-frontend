<template>
    <div class="lyrics-settings">
        <card class="lyrics-settings__verses" border>
            <h2 class="lyrics-settings__verses__title">Verses</h2>
            <label class="lyrics-settings__verses__input" :class="{ 'ignored': ignoreVerses.includes(key) }" v-for="key in Object.keys(verses)" :key="key" @click="toggleVerse(key)">
                <input :id="key" type="checkbox" class="lyrics-settings__verses__input__check" checked>
                <span :for="key" class="lyrics-settings__verses__input__label">{{ verses[key].name }}</span>
            </label>
        </card>
        <card class="lyrics-settings__controls">
            <h2 class="lyrics-settings__controls__title">Controls</h2>
            <button class="lyrics-settings__controls__update" @click="updateLyrics()">Update lyrics</button>
            <button class="lyrics-settings__controls__link" @click="openLyricsWindow" secondary>Go to lyrics</button>
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
    //public verses: Verse[] = [];
    public ignoreVerses: string[] = [];
    public currentVerses: string[] = ["1", "2"];
    public song = useStore(songKey).getters.song;

    public toggleVerse(key: string) {
        console.log(this.verses);
        console.log(key);
        if (this.ignoreVerses.includes(key)) {
            this.ignoreVerses = this.ignoreVerses.filter(k => k != key);
        } else {
            this.ignoreVerses.push(key);
        }
    }

    public openLyricsWindow(){
        window.open('/lyrics', 'Lyrics Viewer', 'resizeable,scrollbars')
    }

    public updateLyrics() {
        localStorage.setItem('lyrics', JSON.stringify(this.current));
        localStorage.setItem('song', JSON.stringify(this.song));
    }

    public get verses() {
        return this.lyrics.verses;
    }

    public get current() {
        const verses: Verse[] = [];

        for (const key of this.currentVerses) {
            verses.push(this.verses[key]);
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

        &__link {
            color: var(--text-color);
            padding: var(--spacing);
            text-align: center;
        }

        &__title {
            margin: 0;
            grid-column: span 2;
        }

        &__update {
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