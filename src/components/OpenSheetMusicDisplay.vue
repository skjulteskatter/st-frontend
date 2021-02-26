<template>
    <div>
        <button v-if="!loaded" @click="load">Leadsheet</button>
        <select
            v-if="loaded"
            @change="load"
            v-model="transposition"    
        >
            <option :value="transpositions[t]" v-for="t in Object.keys(transpositions)" :key="t">{{t}}</option>
        </select>
        <div id="osmd"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { TransposeCalculator } from "../osmd/transpose";
// import zip from "jszip";

@Options({
    props: {
        url: {
            type: String
        },
        transpositions: {
            type: Object
        }
    }
})
export default class OSMD extends Vue {
    public url?: string;
    public loaded = false;
    public transposition = 0;
    public keys = ["Bb", "C", "Db", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", ]
    public transpositions: {
        [key: string]: number;
    } = {};

    public o?: OpenSheetMusicDisplay;

    public mounted() {
        this.o = new OpenSheetMusicDisplay("osmd");
    }

    public async load() {
        if (!this.url || !this.o) return;

        await this.o.load(this.url);

        this.o.TransposeCalculator = new TransposeCalculator();

        this.o.Sheet.Transpose = this.transposition;

        this.o.updateGraphic();

        this.o.render();
        
        this.loaded = true;

    }
}
</script>