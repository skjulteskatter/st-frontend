<template>
    <div>
        <div v-if="loaded" style="display:flex;">
            <base-button @click="transpose(transposition - 1)">-</base-button>
            <base-button>{{ originalKey }} ({{ transposition > 0 ? '+' + transposition : transposition }})</base-button>
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
import { useStore } from "vuex";
import { songKey } from "@/store";

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
        initialTransposition: {
            type: String
        }
    },
})
export default class OSMD extends Vue {
    private songStore = useStore(songKey);
    public url?: string;
    public originalKey = "C";
    public loaded = false;
    public initialTransposition?: number;

    public o?: OpenSheetMusicDisplay;

    public mounted() {
        if (this.initialTransposition) {
            this.transpose(this.initialTransposition);
        } else {
            this.load();
        }
    }

    public transpose(n: number) {
        this.songStore.commit("smTransposition", n);
        this.load();
    }

    public get transposition() {
        return this.songStore.state.smTransposition ?? 0;
    }

    public async getMusicXml() {
        if (!this.url) return '';

        const result = await (await fetch(this.url)).text();
        const xml = result.replace(/<stem>\w*<\/stem>/gm, "");
        return xml;
    }

    public async load() {
        if (!this.o) this.o = new OpenSheetMusicDisplay("osmd");

        await this.o.load(await this.getMusicXml());

        this.o.TransposeCalculator = new TransposeCalculator();

        this.o.Sheet.Transpose = this.transposition;

        this.o.updateGraphic();

        this.o.render();

        this.loaded = true;
    }
}
</script>