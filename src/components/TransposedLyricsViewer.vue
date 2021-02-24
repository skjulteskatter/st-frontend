<template>
    <div v-if="song" class="transposed-lyrics">
        <base-card v-if="lyrics && lyrics.format == 'html'" border header>
            <template #header>
                <div class="transposed-lyrics__header">
                    <div class="transposed-lyrics__header__item">
                        <small class="transposed-lyrics__header__label">
                            {{ $t("song.key") }}
                        </small>

                        <select
                            id="transposition"
                            name="transposition"
                            v-model="selectedTransposition"
                            @change="transpose"
                        >
                            <option
                                v-for="b in buttons"
                                :value="b.value"
                                :key="b"
                            >
                                {{ b.label }}
                            </option>
                        </select>
                    </div>
                </div>
            </template>
            <div
                v-html="lyrics.transposedContent"
                class="transposed-lyrics__body"
            ></div>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, BaseButton, Modal } from "@/components";
import { ButtonGroup } from "@/components/inputs";
import { Collection, Lyrics, Song } from "@/classes";
import { useStore } from "vuex";
import { songKey } from "@/store";

@Options({
    components: {
        BaseCard,
        BaseButton,
        Modal,
        ButtonGroup,
    },
    props: {
        song: {
            type: Object,
        },
        lyrics: {
            type: Object,
        },
    },
})
export default class TransposedLyricsViewer extends Vue {
    private songStore = useStore(songKey);
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    public description = "";
    public title = "";
    public song?: Song;
    public lyrics?: Lyrics;
    public selectedTransposition = this.transposition
        ? this.transpositions[this.transposition]
        : 0;

    public get transpositions() {
        return this.lyrics?.transpositions ?? {};
    }

    public get transposition() {
        return this.lyrics?.transposedToKey ?? this.lyrics?.originalKey ?? "";
    }

    public get languageKey() {
        return this.songStore.state.language;
    }

    public get buttons() {
        const buttons: {
            label: string;
            value: number;
            selected: boolean;
        }[] = [];

        for (const t of Object.keys(this.transpositions)) {
            buttons.push({
                label: t,
                value: this.transpositions[t],
                selected: this.transposition == t,
            });
        }

        return buttons;
    }

    public async transpose() {
        if (this.song) {
            const lyrics = await this.collection?.transposeLyrics(
                this.song.number,
                this.selectedTransposition,
                this.languageKey
            );
            this.songStore.commit("transposedLyrics", lyrics);
        }
    }

    public get collection(): Collection | undefined {
        return this.songStore.getters.collection;
    }
}
</script>

<style lang="scss">
.transposed-lyrics {
    width: 100%;

    &__header {
        width: 100%;
        display: flex;
        gap: calc(var(--st-spacing) / 2);

        &__label {
            display: block;
            opacity: 0.5;
            margin-bottom: 0.2em;
        }
    }

    &__body {
        width: 100%;

        .song {
            --chord-size: 0.9em;
            margin: 0 auto;

            .verse-title {
                font-weight: bold;
            }

            .verse {
                padding: var(--st-spacing);
                border-left: 1px solid var(--st-border-color);

                &:not(:last-child) {
                    margin-bottom: var(--st-spacing);
                }

                .songline {
                    margin: 0;
                }

                .chords {
                    color: var(--st-primary-color);
                    font-weight: bold;
                    font-size: var(--chord-size);
                    line-height: var(--chord-size);
                }
            }
        }
    }
}
</style>