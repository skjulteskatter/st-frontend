<template>
    <base-card class="sheetmusic" :header="!embed" toggleable>
        <template #header>
            <h4 class="sheetmusic__title">{{ $t("song.leadSheet") }}</h4>
            <div v-if="loaded" class="sheetmusic__controls gap-x">
                <div class="sheetmusic__controls__transpose">
                    <Icon
                        name="arrowLeft"
                        class="sheetmusic__controls__button"
                        @click="
                            transposition > -12
                                ? transpose(transposition - 1)
                                : undefined
                        "
                    />
                    <span class="sheetmusic__key">
                        {{ originalKey }} ({{
                            transposition > 0
                                ? "+" + transposition
                                : transposition
                        }})
                    </span>
                    <Icon
                        name="arrowRight"
                        class="sheetmusic__controls__button"
                        @click="
                            transposition < 12
                                ? transpose(transposition + 1)
                                : undefined
                        "
                    />
                </div>
                <div class="sheetmusic__controls__zoom">
                    <small>{{ Math.floor(zoom * 100) }}%</small>
                    <input
                        type="range"
                        v-model="zoom"
                        @change="update"
                        min="0.4"
                        max="1.4"
                        step="0.1"
                    />
                </div>
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
import { Icon } from "@/components/icon";

@Options({
    components: {
        BaseButton,
        BaseCard,
        Icon,
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
        embed: {
            type: Boolean
        },
        zoom: {
            type: Number
        }
    },
})
export default class OSMD extends Vue {
    private songStore = useStore(songKey);
    public url?: string;
    public originalKey = "C";
    public loaded = false;
    public initialTransposition?: number;
    public zoom = 1;
    public embed = false;

    public o?: OpenSheetMusicDisplay;

    public mounted() {
        if (window.innerWidth < 700) {
            this.zoom = this.zoom == 1 ? 0.5 : this.zoom;
        }

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

    public update() {
        if (this.o) {
            this.setZoom();
            this.o.render();
            console.log("updated");
        }
    }

    public setZoom() {
        const breakpoint = 700;
        const pageWidth = window.innerWidth;
        const zoomLevel = pageWidth < breakpoint ? 0.4 : 1;

        if (this.o) {
            this.o.zoom = +this.zoom ?? zoomLevel;
        }
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

        this.setZoom();

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
    &__title {
        margin: 0 0 0.5em 0;
    }

    &__controls {
        display: flex;
        align-items: center;

        &__transpose {
            padding: 0.5em;
            border: 1px solid var(--st-color-primary);
            border-radius: var(--st-border-radius);
            display: flex;
            align-items: center;
        }

        &__zoom {
            display: flex;
            flex-direction: column;

            width: 150px;

            // input[type=range] {

            // }
        }

        &__button {
            color: var(--st-color-primary);
            cursor: pointer;
        }
    }

    &__key {
        padding: 0 var(--st-spacing);
    }
}
</style>