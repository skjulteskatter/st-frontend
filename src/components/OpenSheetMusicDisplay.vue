<template>
    <base-card class="sheetmusic" :header="!embed" toggleable>
        <template #header>
            <h4 class="sheetmusic__title">{{ $t("song.leadSheet") }}</h4>
            <base-button @click="transpose(0)" v-if="!loaded">Load</base-button>
            <button id="pb-control">Controls</button>
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
        <div id="pb-control-panel" style="width:200px"></div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { OpenSheetMusicDisplay } from "@/assets/js/osmd";
import { TransposeCalculator } from "../osmd/transpose";
import { PlaybackControl } from "../osmd/audio";
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
        initialZoom: {
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
    public initialZoom? = undefined;

    public o?: OpenSheetMusicDisplay;

    public mounted() {
        if (this.initialZoom !== undefined) {
            this.zoom = this.initialZoom ?? 1;
        } else {
            if (window.innerWidth < 700) {
                this.zoom = this.zoom == 1 ? 0.5 : this.zoom;
            }
        }

        if (this.initialTransposition !== undefined) {
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
        }
    }

    public setZoom() {
        const breakpoint = 700;
        const pageWidth = window.innerWidth;
        const zoomLevel = pageWidth < breakpoint ? 0.4 : 1;

        if (this.o) {
            this.o.zoom = this.zoom ?? zoomLevel;
        }
    }

    public get transposition() {
        return this.songStore.state.smTransposition ?? 0;
    }

    public async getMusicXml() {
        if (!this.url) return "";

        console.log(this.url);

        const result = await (await fetch(this.url)).text();
        const xml = result.replace(/<stem>\w*<\/stem>/gm, "");
        return xml;
    }

    public async load() {
        if (!this.o) this.o = new OpenSheetMusicDisplay("osmd", {
            autoResize: true,
            backend: "canvas",
            //backend: "canvas",
            disableCursor: false,
            drawingParameters: "default", // try compact (instead of default)
            drawPartNames: true, // try false
            // drawTitle: false,
            // drawSubtitle: false,
            drawFingerings: true,
            fingeringPosition: "left", // left is default. try right. experimental: auto, above, below.
            // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
            setWantedStemDirectionByXml: true, // try false, which was previously the default behavior
            // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.

            //drawMeasureNumbers: false, // disable drawing measure numbers
            //measureNumberInterval: 4, // draw measure numbers only every 4 bars (and at the beginning of a new system)
            useXMLMeasureNumbers: true, // read measure numbers from xml

            // coloring options
            coloringEnabled: true,
            // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
            // defaultColorStem: "#BB0099",

            autoBeam: false, // try true, OSMD Function Test AutoBeam sample
            autoBeamOptions: {
                // eslint-disable-next-line @typescript-eslint/camelcase
                beam_rests: false,
                // eslint-disable-next-line @typescript-eslint/camelcase
                beam_middle_rests_only: false,
                //groups: [[3,4], [1,1]],
                // eslint-disable-next-line @typescript-eslint/camelcase
                maintain_stem_directions: false
            },
            // pageBackgroundColor: pageBackgroundColor,
            // renderSingleHorizontalStaffline: singleHorizontalStaffline
            pageBackgroundColor: "#ffffff"
        });

        await this.o.load(await this.getMusicXml());

        this.o.TransposeCalculator = new TransposeCalculator();

        this.o.Sheet.Transpose = this.transposition;

        // Set options (colors, fonts)
        // this.o.setOptions({
        //     backend: "canvas",
        //     // defaultColorTitle: "var(--st-color-text)",
        //     // defaultColorStem: "var(--st-color-text)",
        //     // defaultColorRest: "var(--st-color-text)",
        //     // defaultColorLabel: "var(--st-color-text)",
        //     // defaultColorNotehead: "var(--st-color-text)",
        //     pageFormat: "A4_P",
        //     defaultFontFamily: "Inter",
        //     pageBackgroundColor: "#ffffff",
        // });

        this.setZoom();

        this.o.updateGraphic();

        this.o.render();
        
        const pbcButton = document.getElementById("pb-control");
        const pbcp = document.getElementById("pb-control-panel");
        if (!pbcButton || !pbcp) throw new Error("Couldnt get element");

        const playbackControl = PlaybackControl(this.o, pbcp);
        pbcButton.addEventListener("click", function(){
            if(!playbackControl.IsClosed()){
                playbackControl.hideControls();
            } else {
                playbackControl.showControls();
            }
        });

        playbackControl.initialize();

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