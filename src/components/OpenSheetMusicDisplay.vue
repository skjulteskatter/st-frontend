<template>
    <base-card class="sheetmusic" header toggleable>
        <template #header>
            <div v-if="loaded" class="sheetmusic__controls">
                <base-button
                    @click="
                        transposition > -12
                            ? transpose(transposition - 1)
                            : undefined
                    "
                    >-</base-button
                >
                <span class="sheetmusic__key">
                    {{ originalKey }} ({{
                        transposition > 0 ? "+" + transposition : transposition
                    }})
                </span>
                <base-button
                    @click="
                        transposition < 12
                            ? transpose(transposition + 1)
                            : undefined
                    "
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
import { useStore } from "vuex";
import { songKey } from "@/store";
import { BaseButton, BaseCard } from "@/components";

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

        if (this.o) {
            this.o.Sheet.Transpose = this.transposition;

            this.o.updateGraphic();

            this.o.render();
        } else {
            this.load();
        }
    }

    public get pageZoom(): number {
        const breakpoint = 700;
        const pageWidth = window.innerWidth;
        const zoomLevel = pageWidth < breakpoint ? 0.4 : 1;
        return zoomLevel;
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

        // Set options (colors, fonts)
        this.o.setOptions({
            backend: "canvas",
            // defaultColorTitle: "var(--st-color-text)",
            // defaultColorStem: "var(--st-color-text)",
            // defaultColorRest: "var(--st-color-text)",
            // defaultColorLabel: "var(--st-color-text)",
            // defaultColorNotehead: "var(--st-color-text)",
            pageFormat: "A4_P",
            defaultFontFamily: "Inter",
            pageBackgroundColor: "#ffffff",
        });

        this.o.zoom = this.pageZoom;

        this.o.updateGraphic();

        this.o.render();

        this.loaded = true;
    }
}
</script>

<style lang="scss">
#osmd {
    max-width: 900px;
}

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