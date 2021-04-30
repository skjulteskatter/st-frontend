<template>
    <div class="lyrics-settings" v-if="song">
        <base-card
            v-if="song.type == 'lyrics'"
            class="lyrics-settings__controls"
        >
            <h3 class="lyrics-settings__controls__title">
                {{ $t("song.control") }}
            </h3>
            <base-button
                class="lyrics-settings__controls__open"
                @click="openLyricsWindow('lyrics')"
            >
                {{ $t("song.openviewer") }}
            </base-button>
            <base-button
                class="lyrics-settings__controls__update"
                @click="updateLyrics"
            >
                {{ $t("song.updateviewer") }}
            </base-button>
            <base-button
                class="lyrcis-settings__controls__previous"
                @click="previous"
                theme="secondary"
            >
                {{ $t("common.previous") }}
            </base-button>
            <base-button
                class="lyrcis-settings__controls__next"
                @click="next"
                theme="secondary"
            >
                {{ $t("common.next") }}
            </base-button>
            <!-- <br />
            <base-button
                class="lyrics-settings__controls__open"
                @click="openLyricsWindow('karaoke')"
            >
                Open KaraokeViewer
            </base-button>
            <base-button @click="setLineSize(1)">1</base-button>
            <base-button @click="setLineSize(2)">2</base-button> -->
        </base-card>
        <base-card v-if="song.type == 'lyrics'" class="lyrics-settings__verses">
            <h3 class="lyrics-settings__verses__title">
                {{ $t("song.verse") }}
            </h3>
            <div
                class="lyrics-settings__verses__select gap-x"
                v-for="key in Object.keys(selectVerses)"
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
            <!-- <div
                class="lyrics-settings__verses__input"
                :class="{ selected: selected.includes(key) }"
                v-for="key in Object.keys(verses)"
                :key="key"
            >
                <input
                    :id="key"
                    type="checkbox"
                    class="lyrics-settings__verses__input__check"
                    checked
                    @click="toggleVerse(key)"
                />
                <label
                    :for="key"
                    class="lyrics-settings__verses__input__label"
                    >{{ verses[key].name }}
                </label>
            </div> -->
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics, Song } from "@/classes";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";

@Options({
    components: {
        BaseCard,
        BaseButton,
        Modal,
    },
    props: {
        lyrics: {
            type: Object,
            default: () => undefined,
        },
        languageKey: {
            type: String,
            default: () => "",
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
    public languageKey = "";
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
            this.song?.melodyOrigin?.name[this.languageKey] ??
            this.song?.melodyOrigin?.name.no ??
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
            margin-top: 0;
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
