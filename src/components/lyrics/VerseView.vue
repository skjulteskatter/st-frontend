<template>      
    <div :class="type">
        <span :class="type + '-title'">{{Verse.name}}</span>
        <div class="content">
            <table class="songline mb-4" v-for="(line, i) in Verse.content" :key="i">
                <tr class="chords">
                    <td v-for="(chord, i) in line.chords" :key="i">
                        <ChordViewer :text="chord" :chord="chord" />
                    </td>
                </tr>
                <tr class="lyrics">
                    <td v-for="(chord, i) in line.parts" :key="i" :class="{'indent': chord.startsWith(' ')}">{{chord.trimStart()}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { LyricsChordContent } from "songtreasures-api";
import ChordViewer from "./ChordViewer.vue";

export default defineComponent({
    name: "verse-view",
    props: {
        verse: {
            type: Object as PropType<LyricsChordContent>,
        },
    },
    computed: {
        Verse() {
            return this.verse ?? {
                name: "1",
                content: [],
                key: "verse_1",
            };
        },
        type() {
            return this.Verse.key.split("_")[0];
        },
    },
    components:{
        ChordViewer,
    },
});
</script>

<style lang="scss">
.verse-title,
.chorus-title {
    font-weight: bold;
    font-size: .9em;
}

.content,
.chorus {
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
        .chord-title{
            color: var(--st-color-primary);
            font-weight: bold;
            font-size: var(--chord-size);
            line-height: var(--chord-size);
        }
        user-select: none;
    }
}
</style>
