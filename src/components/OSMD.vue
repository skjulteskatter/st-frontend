<template>
    <div class="osmd-wrapper">
        <div class="osmd-controls">
            <div class="osmd-controls__transpose">
                <Icon
                    name="arrowLeft"
                    class="osmd-controls__button"
                    @click="
                        transposition > -12
                            ? transpose(transposition - 1)
                            : undefined
                    "
                />
                <span class="osmd-controls__key">
                    Key ({{
                        transposition > 0
                            ? "+" + transposition
                            : transposition
                    }})
                </span>
                <Icon
                    name="arrowRight"
                    class="osmd-controls__button"
                    @click="
                        transposition < 12
                            ? transpose(transposition + 1)
                            : undefined
                    "
                />
                <div class="osmd-controls__zoom">
                    <small>{{ Math.floor(zoom * 100) }}%</small>
                    <input
                        type="range"
                        v-model="zoom"
                        @change="rerender"
                        min="0.4"
                        max="1.4"
                        step="0.1"
                    />
                </div>
            </div>
        </div>
        <div id="osmd-canvas"></div>
        <div id="pb-controls" style="left: 100px; max-width: 500px;"></div>
    </div>
</template>
<script lang="ts">
import { BasicAudioPlayer, ControlPanel, IAudioMetronomePlayer, IMessageViewer, LinearTimingSource, OpenSheetMusicDisplay, PlaybackManager, TransposeCalculator } from "@/assets/js/osmd";
import { Options, Vue } from "vue-class-component";

import { Icon } from "@/components/icon";

@Options({
    components: {
        Icon,
    },
    props: {
        url: {
            type: String
        },
        initialTransposition: {
            type: Number
        },
        initialZoom: {
            type: Number
        }
    }
})
export default class OSMD extends Vue {
    private url?: string;
    private osmd: OpenSheetMusicDisplay = undefined as unknown as OpenSheetMusicDisplay;
    private canvas: HTMLElement = undefined as unknown as HTMLElement;
    private pbcanvas: HTMLElement = undefined as unknown as HTMLElement;
    private initialTransposition?: number;
    public transposition = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private playbackControl: any;
    private initialZoom?: number;
    public zoom = 1;

    mounted() {
        this.transposition = this.initialTransposition != undefined ? this.initialTransposition : 0;
        this.zoom = this.initialZoom != undefined ? this.initialZoom : window.innerWidth < 700 ? 0.5 : this.zoom;

        const canvas = document.getElementById("osmd-canvas");
        const pbcanvas = document.getElementById("pb-controls");

        if (canvas && pbcanvas) {
            this.canvas = canvas;
            this.pbcanvas = pbcanvas;
            
            this.osmd = new OpenSheetMusicDisplay(this.canvas, {
                autoResize: true,
                backend: "canvas",
                disableCursor: false,
                drawingParameters: "default", // try compact (instead of default)
                drawPartNames: true, // try false
                drawTitle: false,
                drawSubtitle: false,
                drawFingerings: true,
                fingeringPosition: "left", // left is default. try right. experimental: auto, above, below.
                // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
                setWantedStemDirectionByXml: false, // try false, which was previously the default behavior
                // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.
                drawUpToMeasureNumber: Number.MAX_SAFE_INTEGER,
                drawFromMeasureNumber: 0,


                //drawMeasureNumbers: false, // disable drawing measure numbers
                measureNumberInterval: 4, // draw measure numbers only every 4 bars (and at the beginning of a new system)
                //useXMLMeasureNumbers: true, // read measure numbers from xml

                // coloring options
                //coloringEnabled: true,
                // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
                // defaultColorStem: "#BB0099",
                defaultFontFamily: "Inter",

                autoBeam: true, // try true, OSMD Function Test AutoBeam sample
                autoBeamOptions: {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    beam_rests: false,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    beam_middle_rests_only: false,
                    //groups: [[3,4], [1,1]],
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    maintain_stem_directions: false
                },
                pageBackgroundColor: "#FFFFFF",
            });

            this.playbackControl = this.demoPlaybackControl(this.osmd);

            this.init();

        } else {
            throw new Error("Couldn't get the canvas for OSMD")
        }
    }

    public async getMusicXml() {
        if (!this.url) return "";

        console.log(this.url);

        const result = await (await fetch(this.url)).text();
        return result;
    }

    public async init() {
        if (!this.url) throw new Error("URL not found. Aborting load");
        this.canvas.innerHTML = "";

        this.osmd.setLogLevel("debug");

        await this.osmd.load(await this.getMusicXml());
        
        this.osmd.TransposeCalculator = new TransposeCalculator();

        this.osmd.Sheet.Transpose = this.transposition;

        this.osmd.updateGraphic();

        this.osmd.zoom = this.zoom;

        this.osmd.render();

        this.playbackControl.initialize();
    }

    public rerender() {
        this.disable();
        if (this.osmd?.IsReadyToRender()) {
            this.osmd.zoom = this.zoom;
            this.osmd.render();
        }
        this.enable();
    }

    public transpose(n: number) {
        this.transposition = n;

        this.osmd.Sheet.Transpose = this.transposition;

        this.osmd.updateGraphic();
        
        this.rerender();
    }

    public disable() {
        this.canvas.style.opacity = "0.4";
    }

    public enable() {
        this.canvas.style.opacity = "";
    }

    public demoPlaybackControl(osmd: OpenSheetMusicDisplay) {
        const openSheetMusicDisplay = this.osmd;

        const playbackListener = {
            play() {
                openSheetMusicDisplay.FollowCursor = true;
            },
            pause() {
                console.log("pause");
            },
            reset() {
                console.log("pause");},
            bpmChanged() {
                console.log("pause");},
            volumeChanged() {
                console.log("pause");},
            volumeMute() {
                console.log("pause");},
            volumeUnmute() {
                console.log("pause");}
        }

        const timingSource = new LinearTimingSource();
        const playbackManager = new PlaybackManager(timingSource, undefined as unknown as IAudioMetronomePlayer, new BasicAudioPlayer(), undefined as unknown as IMessageViewer);
        playbackManager.DoPlayback = true;
        playbackManager.DoPreCount = false;

        const playbackControlPanel = new ControlPanel(this.pbcanvas);
        playbackControlPanel.addListener(playbackManager);
        playbackControlPanel.addListener(playbackListener);

        function initialize() {
            timingSource.reset();
            timingSource.pause();
            timingSource.Settings = osmd.Sheet.SheetPlaybackSetting;
            playbackManager.initialize(osmd.Sheet.MusicPartManager);
            playbackManager.addListener(osmd.cursor);
            playbackManager.reset();
            osmd.PlaybackManager = playbackManager;
            playbackControlPanel.clearVolumeTracks();
            playbackControlPanel.addVolumeTrack(playbackManager.Metronome.Name, playbackManager.Metronome.Id, playbackManager.Metronome.Volume*100);
            for(const instrId of playbackManager.InstrumentIdMapping.keys()) {
                const instr = playbackManager.InstrumentIdMapping.getValue(instrId);
                if (!instr) continue;
                playbackControlPanel.addVolumeTrack(instr.Name, instrId, instr.Volume * 100);
            }
            playbackControlPanel.bpmChanged(osmd.Sheet.DefaultStartTempoInBpm);
        }

        function showControls() {
            playbackControlPanel.show();
        }

        function hideControls() {
            playbackControlPanel.hideAndClear();
        }

        function IsClosed() {
            return playbackControlPanel.IsClosed;
        }

        return { 
            initialize: initialize,
            showControls: showControls,
            hideControls: hideControls,
            IsClosed: IsClosed
        }
    }
}
</script>
<style lang="scss">
.osmd-controls {
    &__title {
        margin: 0 0 0.5em 0;
    }
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

    &__key {
        padding: 0 var(--st-spacing);
    }
}
</style>

