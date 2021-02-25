<template>
    <div v-if="lyrics" class="transposed-lyrics">
        <!-- <base-card v-if="lyrics && lyrics.format == 'html'" border header>
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
                                v-for="t in Object.keys(this.transpositions)"
                                :value="this.transpositions[t]"
                                :key="t"
                            >
                                {{ t }}
                            </option>
                        </select>
                    </div>
                    <slot/>
                </div>
            </template>
        </base-card> -->
        
        <div
            v-html="lyrics.transposedContent"
            class="transposed-lyrics__body"
        ></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {  BaseButton, Modal } from "@/components";
import { ButtonGroup } from "@/components/inputs";
import { Collection, Lyrics } from "@/classes";
import { useStore } from "vuex";
import { songKey } from "@/store";

@Options({
    components: {
        BaseButton,
        Modal,
        ButtonGroup,
    },
    props: {
        lyrics: {
            type: Object,
        },
        selectedTransposition: {
            type: Number,
        }
    },
})
export default class TransposedLyricsViewer extends Vue {
    private songStore = useStore(songKey);
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    public description = "";
    public title = "";
    public lyrics?: Lyrics;
    public selectedTransposition = 0;

    public get transpositions() {
        return this.lyrics?.transpositions ?? {};
    }

    public get transposition() {
        return this.lyrics?.transposedToKey ?? this.lyrics?.originalKey ?? "";
    }

    public get languageKey() {
        return this.songStore.state.language;
    }

    public async transpose(t: number) {
        if (this.lyrics) {
            const lyrics = await this.collection?.transposeLyrics(
                this.lyrics.number,
                t,
                this.languageKey
            );
            this.songStore.commit("view", "transpose");
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

        &__settings {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            gap: calc(var(--st-spacing) / 2);
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