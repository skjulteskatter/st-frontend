<template>
    <div>
        <button v-if="!loaded" @click="load">Leadsheet</button>
        <select
            @change="load"
            v-model="transposition"    
        >
            <option :value="t" v-for="t in transpositions" :key="t">{{t}}</option>
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
    }
})
export default class OSMD extends Vue {
    public url?: string;
    public loaded = false;
    public transposition = 0;
    public transpositions = [-3, -2, -1, 0, 1, 2, 3];

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