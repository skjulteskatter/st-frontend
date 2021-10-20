<template>
    <div v-for="(verse, i) in CurrentVerses" :key="verse.name + i.toString()">
        <hr />
        <p v-for="(line, i) in verse.content" :key="i">
            {{line}}
        </p>
    </div>
</template>
<script lang="ts">
import { Lyrics } from "@/classes";
import { ILyrics } from "songtreasures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "performance-view",
    props: {
        lyrics: {
            type: Object,
        },
    },
})
export default class PerformanceView extends Vue {
    public currentVerse = 0;
    public twoVerses = false;
    private lyrics?: Lyrics;

    public get Lyrics() {
        return this.lyrics ?? new Lyrics({} as ILyrics);
    }

    public get CurrentVerses() {
        const verses = Object.values(this.Lyrics.verses);

        const result = [verses[this.currentVerse]];

        if (this.twoVerses) {
            result.push(verses[this.currentVerse + 1]);
        }

        return result;
    }
}
</script>
