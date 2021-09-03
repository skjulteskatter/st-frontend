<template>
    <div
        v-if="lyrics"
        class="transposed-lyrics"
        v-html="lyrics.transposedContent"
    ></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics } from "@/classes";

@Options({
    name: "transposed-lyrics-viewer",
    props: {
        lyrics: {
            type: Object,
        },
    },
})
export default class TransposedLyricsViewer extends Vue {
    public lyrics?: Lyrics;
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

        .verse,
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
