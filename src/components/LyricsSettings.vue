<template>
    <div class="lyrics-settings" v-if="song">
        <base-card class="lyrics-settings__viewer">
            <h4 class="lyrics-settings__viewer__title">
                {{ $t("song.viewer") }}
            </h4>
            <div class="lyrics-settings__viewer__buttons">
                <base-button
                    class="lyrics-settings__controls__open"
                    theme="tertiary"
                    @click="openLyricsWindow('lyrics')"
                >
                    {{ $t("song.openviewer") }}
                </base-button>
                <base-button
                    class="lyrics-settings__controls__update"
                    theme="tertiary"
                    icon="refresh"
                    @click="updateLyrics"
                >
                    {{ $t("song.updateviewer") }}
                </base-button>
            </div>
        </base-card>
        <base-card
            v-if="song.type == 'lyrics'"
            class="lyrics-settings__controls"
        >
            <h4 class="lyrics-settings__controls__title">
                {{ $t("song.controlpanel") }}
            </h4>
            <div class="lyrics-settings__controls__buttons">
                <base-button
                    class="lyrcis-settings__controls__previous"
                    icon="arrowLeft"
                    @click="previous"
                    theme="secondary"
                >
                    {{ $t("common.previous") }}
                </base-button>
                <base-button
                    class="lyrcis-settings__controls__next"
                    @click="next"
                    theme="secondary"
                    icon="arrowRight"
                >
                    {{ $t("common.next") }}
                </base-button>
            </div>
            <div v-if="song.type == 'lyrics'" class="lyrics-settings__controls__verses">
                <h5 class="lyrics-settings__verses__title">
                    {{ $t("common.show") }} / {{ $t('common.hide') }}
                </h5>
                <div
                    class="lyrics-settings__verses__select gap-x"
                    v-for="key in verseSelect"
                    :key="key"
                >
                    <input
                        v-model="selectVerses[key]"
                        type="checkbox"
                        :name="key"
                        :id="key"
                    />
                    <label :for="key">
                        {{ verses[key].name }}
                    </label>
                </div>
            </div>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics, Song } from "@/classes";
import Modal from "@/components/Modal.vue";

@Options({
    components: {
        Modal,
    },
    props: {
        lyrics: {
            type: Object,
        },
        languageKey: {
            type: String,
            default: "",
        },
        song: {
            type: Object,
        },
    },
    name: "lyrics-settings",
})
export default class LyricsSettings extends Vue {
    public selectVerses: {
        [key: string]: boolean;
    } = {};
    public currentVerseNumber = 0;
    public currentLinesNumber = 0;
    public lyrics?: Lyrics;
    public languageKey?: string;
    public song?: Song;

    public lineSize = 2;

    // public toggleVerse(key: string) {
    // }

    public async mounted() {
        for (const key of Object.keys(this.verses)) {
            this.selectVerses[key] = true;
        }

        window.addEventListener("keydown", (event) => {
            if (event.key == "ArrowRight") {
                this.next();
            }
            if (event.key == "ArrowLeft") {
                this.previous();
            }
        });

        window.addEventListener("storage", (event) => {
            if (event.key == "lyrics_next") {
                this.next();
            }
            if (event.key == "lyrics_previous") {
                this.previous();
            }
        });
    }

    public setLineSize(number: number) {
        this.lineSize = number;
        localStorage.setItem("lyrics_lines", JSON.stringify(this.currentLines));
    }

    public openLyricsWindow(type: string) {
        this.updateLyrics();
        window.open("/" + type, "Lyrics Viewer", "resizeable,scrollbars");
    }

    public updateLyrics() {
        // if (this.size == 1) {
        //     this.currentVerses = [1];
        // }
        // if (this.size == 2) {
        //     this.currentVerses = [1, 2];
        // }

        localStorage.setItem("lyrics", JSON.stringify(this.current));
        localStorage.setItem("song", JSON.stringify(this.song));
        localStorage.setItem("lyrics_lines", JSON.stringify(this.currentLines));
    }

    public next() {
        if (this.size == 2) {
            this.currentVerseNumber = this.currentVerseNumber + 2;
        } else {
            this.currentVerseNumber++;
        }
        this.currentLinesNumber = this.currentLinesNumber + this.lineSize;
        localStorage.setItem("lyrics", JSON.stringify(this.current));
        localStorage.setItem("lyrics_lines", JSON.stringify(this.currentLines));
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
        localStorage.setItem("lyrics", JSON.stringify(this.current));
        localStorage.setItem("lyrics_lines", JSON.stringify(this.currentLines));
    }

    public get selected() {
        return Object.keys(this.verses).filter((v) => this.selectVerses[v]);
    }

    public get verses() {
        return this.lyrics?.verses ?? {};
    }

    public get size() {
        return this.verses[1].content.length <= 5 ? 2 : 1;
    }

    public get melodyOrigin() {
        return (
            this.song?.melodyOrigin?.description[this.languageKey ?? "en"] ??
            this.song?.melodyOrigin?.description.no ??
            undefined
        );
    }

    public get currentVerses(): string[] {
        const keys = [];
        if (this.size == 1) {
            if (this.selected[this.currentVerseNumber])
                keys.push(this.selected[this.currentVerseNumber]);
        } else if (this.size == 2) {
            if (this.selected[this.currentVerseNumber])
                keys.push(this.selected[this.currentVerseNumber]);
            if (this.selected[this.currentVerseNumber + 1])
                keys.push(this.selected[this.currentVerseNumber + 1]);
        }
        return keys;
    }

    public get currentLines(): string[] {
        const lines = this.lyrics?.lines ?? [];

        return (
            lines.slice(
                this.currentLinesNumber,
                this.currentLinesNumber + this.lineSize,
            ) ?? []
        );
    }

    public get current() {
        const verses: Verse[] = [];

        for (const key of this.currentVerses) {
            if (this.verses[key]) verses.push(this.verses[key]);
        }

        return verses;
    }

    public get verseSelect() {
        return Object.keys(this.selectVerses).reduce((a, b) => a.length < 20 ? [...a, b] : a, [] as string[]);
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
    flex-shrink: 0;

    display: flex;
    flex-direction: column;
    gap: var(--st-spacing);

    &__viewer {
        &__title {
            margin-top: 0;
        }

        &__buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: calc(var(--st-spacing)/2);
        }
    }

    &__controls {
        .card__content {
            display: flex;
            flex-direction: column;
            gap: var(--st-spacing);
        }

        &__verses {
            margin-top: var(--st-spacing);
        }

        &__buttons {
            display: flex;
            gap: calc(var(--st-spacing)/2);
        }

        &__title {
            margin: 0;
        }
    }

    &__verses {
        .card__content {
            width: 100%;
        }

        &__select {
            width: 100%;
            display: flex;

            label {
                flex-grow: 1;
            }
        }

        &__title {
            margin: 0 0 calc(var(--st-spacing)/2) 0;
        }

        &__input {
            border-radius: var(--st-border-radius);
            overflow: hidden;
            font-size: 1.1em;

            display: flex;
            flex-direction: column;
            //align-items: center;
            gap: var(--st-spacing);

            &__check {
                display: none;

                &:checked + span {
                    color: white;
                    background: var(--st-color-primary);
                }
            }

            &__label {
                padding: var(--half-spacing);
                background: var(--st-color-background);
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
