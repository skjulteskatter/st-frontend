<template>
    <div>
        <base-button v-if="!loaded" @click="load">Leadsheet</base-button>
        <!-- <select
            v-if="loaded"
            @change="load"
            v-model="transposition"    
        >
            <option :value="ts[t]" v-for="t in Object.keys(ts)" :key="t">{{t}}</option>
        </select> -->
        <div v-if="loaded" style="display: flex">
            <base-button @click="close">{{ $t("common.close") }}</base-button>
            <base-button @click="transpose(transposition - 1)">-</base-button>
            <base-button
                >{{ originalKey }} ({{
                    transposition > 0 ? "+" + transposition : transposition
                }})</base-button
            >
            <base-button @click="transpose(transposition + 1)">+</base-button>
        </div>
        <div id="osmd"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { TransposeCalculator } from "../osmd/transpose";
import { BaseButton } from "@/components";

@Options({
    components: {
        BaseButton,
    },
    props: {
        url: {
            type: String,
        },
        originalKey: {
            type: String,
        },
    },
})
export default class OSMD extends Vue {
    public url?: string;
    public originalKey = "C";
    public loaded = false;
    public transposition = 0;

    public o?: OpenSheetMusicDisplay;

    public transpose(n: number) {
        this.transposition = n;
        this.load();
    }

    public close() {
        this.o?.clear();

        const el = document.getElementById("osmd");
        if (el) {
            el.innerHTML = "";
        }
        this.loaded = false;
    }

    public async load() {
        if (!this.o) this.o = new OpenSheetMusicDisplay("osmd");

        if (!this.url) return;

        await this.o.load(this.url);

        this.o.TransposeCalculator = new TransposeCalculator();

        this.o.Sheet.Transpose = this.transposition;

        this.o.updateGraphic();

        this.o.render();

        this.loaded = true;
    }
}
</script>