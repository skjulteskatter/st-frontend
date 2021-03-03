<template>
    <base-card class="sheetmusic" header>
        <template #header>
            <div v-if="loaded" class="sheetmusic__controls">
                <base-button @click="transposition > -12 ? transpose(transposition - 1) : undefined"
                    >-</base-button
                >
                <span class="sheetmusic__key">
                    {{ originalKey }} ({{
                        transposition > 0 ? "+" + transposition : transposition
                    }})
                </span>
                <base-button @click="transposition < 12 ? transpose(transposition + 1) : undefined"
                    >+</base-button
                >
            </div>
        </template>
        <div id="osmd"></div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { TransposeCalculator } from "../osmd/transpose";
import { BaseButton, BaseCard } from "@/components";
import { useStore } from "vuex";
import { songKey } from "@/store";

@Options({
    components: {
        BaseButton,
        BaseCard,
    },
    props: {
        url: {
            type: String,
        },
        originalKey: {
            type: String,
        },
        initialTransposition: {
            type: String,
        },
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
            this.o?.clear();
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
        if (!this.url) return "";

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

<style lang="scss">
.sheetmusic {
    &__controls {
        display: flex;
        align-items: center;
    }

    &__key {
        padding: 0 var(--st-spacing);
    }
}
</style>