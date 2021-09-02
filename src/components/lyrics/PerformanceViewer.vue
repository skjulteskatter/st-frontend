<template>
    <div
        v-if="lyrics"
        class="transposed-lyrics"
    >
        <button @click="currentVerseIndex > 0 ? currentVerseIndex-- : undefined">Previous</button>
        <button @click="lyrics && currentVerseIndex < lyrics.performanceView.length -1 ? currentVerseIndex++ : undefined">Next</button>
        <div class="song">
            <div class="verse" v-for="(v, i) in currentVerses" :key="i">
                <span class="verse-title">{{v.name}}</span>
                <div class="content"  v-html="v.content"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics } from "@/classes";
import { useStore } from "@/store";

@Options({
    name: "transposed-lyrics-viewer",
    props: {
        lyrics: {
            type: Object,
        },
    },
})
export default class TransposedLyricsViewer extends Vue {
    private store = useStore();
    private currentVerseIndex = 0;
    public lyrics?: Lyrics;

    public get currentVerses() {
        return this.lyrics?.performanceView.slice(this.currentVerseIndex, this.currentVerseIndex + 1) ?? [];
    }
}
</script>

<style lang="scss">
.transposed-lyrics {
    .song {
        --chord-size: 1em;
        line-height: 1.5em;

        .verse-title,
        .chorus-title {
            font-weight: bold;
            font-size: .9em;
        }

        .content,
        .chorus {
            &:not(:last-child) {
                margin-bottom: calc(var(--st-spacing)*2);
            }

            .songline {
                margin: 0;
                border-collapse: collapse;
                white-space: pre;

                td {
                    padding: 0;
                }

                .indent:before {
                    content: " ";
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
