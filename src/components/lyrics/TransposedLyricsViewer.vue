<template>
    <div
        v-if="lyrics"
        class="transposed-lyrics"
        v-html="lyrics.transposedContent"
    ></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton, Modal } from "@/components";
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
    },
})
export default class TransposedLyricsViewer extends Vue {
    private songStore = useStore(songKey);
    public lyrics?: Lyrics;

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

    .song {
        --chord-size: 1em;
        margin: 0 auto;
        font-size: 0.8em;
        line-height: 1.5em;

        .verse-title,
        .chorus-title {
            font-weight: bold;
        }

        .verse,
        .chorus {
            &:not(:last-child) {
                margin-bottom: var(--st-spacing);
            }

            .songline {
                margin: 0;
                border-collapse: collapse;

                td {
                    padding: 0;
                }
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
</style>