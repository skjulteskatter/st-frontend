<template>
    <div
        v-if="lyrics"
        class="performance-viewer"
    >
        <div class="song">
            <div v-for="(v, i) in currentVerses" :class="v.key.split('_')[0]" :key="i">
                <span :class="v.key.split('_')[0] + '-title'">{{v.name}}</span>
                <div class="content">
                    <table class="songline mb-4" v-for="(line, i) in v.content" :key="i">
                        <tr class="chords">
                            <td v-for="(chord, i) in line.chords" :key="i">{{chord + ' '}}</td>
                        </tr>
                        <tr class="lyrics">
                            <td v-for="(chord, i) in line.parts" :key="i" :class="{'indent': chord.startsWith(' ')}">{{chord.trimStart()}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="flex mt-2">
            <base-button @click="previous">{{ $t('common.previous') }}</base-button>
            <base-button class="ml-2" @click="next">{{$t('common.next')}}</base-button>
        </div>
    </div>
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
    private currentVerseIndex = 0;
    private length = 0;
    public lyrics?: Lyrics;

    private eventListener = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            this.previous();
        }
        if (e.key === "ArrowRight") {
            this.next();
        }
    }

    public mounted() {
        this.length = this.lyrics?.performanceView.length ?? 0;
        window.addEventListener("keydown", this.eventListener);
    }

    public unmounted() {
        window.removeEventListener("keydown", this.eventListener);
    }

    public get currentVerses() {
        return this.lyrics?.performanceView.slice(this.currentVerseIndex, this.currentVerseIndex + 1) ?? [];
    }

    public next() {
        if (this.currentVerseIndex < this.length -1)
            this.currentVerseIndex++;
    }

    public previous() {
        if (this.currentVerseIndex > 0)
            this.currentVerseIndex--;
    }
}
</script>

<style lang="scss">
.performance-viewer {
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
            // &:not(:last-child) {
            //     margin-bottom: calc(var(--st-spacing)*2);
            // }

            .songline {
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
