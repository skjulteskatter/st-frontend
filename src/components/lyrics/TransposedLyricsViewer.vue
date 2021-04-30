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
import { Collection } from "@/classes";
import { useStore } from "@/store";

@Options({
    name: "transposed-lyrics-viewer",
    components: {
        BaseButton,
        Modal,
        ButtonGroup,
    },
})
export default class TransposedLyricsViewer extends Vue {
    private store = useStore();

    public get languageKey() {
        return this.store.state.songs.language;
    }

    public get transcode() {
        return this.store.state.songs.transcode;
    }

    // public async transpose(t: number) {
    //     if (this.lyrics) {
    //         const lyrics = await this.collection?.transposeLyrics(
    //             this.lyrics.number,
    //             t,
    //             this.languageKey,
    //             this.transcode,
    //         );
    //         this.store.commit(SongsMutationTypes.SET_VIEW, "transpose");
    //         this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, lyrics?.transposition);
    //     }
    // }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }

    public get lyrics() {
        return this.store.getters.lyrics;
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
                white-space: pre;

                td {
                    padding: 0;
                }
            }

            .chords {
                color: var(--st-color-primary);
                font-weight: bold;
                font-size: var(--chord-size);
                line-height: var(--chord-size);
            }
        }
    }
}
</style>
