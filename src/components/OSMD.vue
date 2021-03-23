<template>
    <div class="osmd-wrapper" v-if="createdDone">
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
                <span class="osmd-controls__key" 
                    @click="transpose(0)"
                >
                    {{ originalKey ?? "Key" }} ({{
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
        <base-button @click="playbackControl.toggleControls()">Controls</base-button>
    </div>
</template>
<script lang="ts">
import { BasicAudioPlayer, ControlPanel, IAudioMetronomePlayer, IMessageViewer, LinearTimingSource, OpenSheetMusicDisplay, PlaybackManager, TransposeCalculator } from "@/assets/js/osmd";
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";
import { BaseButton } from "@/components";

@Options({
    components: {
        Icon,
        BaseButton
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
        },
        originalKey: {
            type: String
        }
    }
})
export default class OSMD extends Vue {
    private url?: string;
    private osmd: OpenSheetMusicDisplay = undefined as unknown as OpenSheetMusicDisplay;
    private canvas: HTMLElement = undefined as unknown as HTMLElement;
    private pbcanvas: HTMLElement = undefined as unknown as HTMLElement;
    private initialTransposition?: number;
    public originalKey?: string;
    public transposition = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public playbackControl: any;
    private initialZoom?: number;
    public zoom = 1;
    public createdDone = false;

    unmounted() {
        this.createdDone = false;
        this.osmd.clear();
        this.playbackControl.clear();
    }

    created() {
        this.createdDone = true;
    }

    mounted() {
        this.transposition = this.initialTransposition != undefined ? this.initialTransposition : 0;
        this.zoom = this.initialZoom != undefined ? this.initialZoom : window.innerWidth < 900 ? 0.4 : this.zoom;

        const canvas = document.getElementById("osmd-canvas");
        const pbcanvas = document.getElementById("pb-controls");

        if (canvas && pbcanvas) {
            this.canvas = canvas;
            this.pbcanvas = pbcanvas;
            
            this.osmd = new OpenSheetMusicDisplay(this.canvas, {
                autoResize: true,
                backend: "canvas",
                drawingParameters: "default", // try compact (instead of default)
                drawPartNames: false, // try false
                drawTitle: false,
                drawSubtitle: false,
                disableCursor: false,
                // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
                setWantedStemDirectionByXml: false, // try false, which was previously the default behavior
                // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.
                drawUpToMeasureNumber: Number.MAX_SAFE_INTEGER,
                drawFromMeasureNumber: 0,

                //drawMeasureNumbers: false, // disable drawing measure numbers
                //measureNumberInterval: 4, // draw measure numbers only every 4 bars (and at the beginning of a new system)
                useXMLMeasureNumbers: true, // read measure numbers from xml

                // coloring options
                //coloringEnabled: true,
                // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
                // defaultColorStem: "#BB0099",
                defaultFontFamily: "Inter",

                // autoBeam: false, // try true, OSMD Function Test AutoBeam sample
                // autoBeamOptions: {
                //     // eslint-disable-next-line @typescript-eslint/camelcase
                //     beam_rests: false,
                //     // eslint-disable-next-line @typescript-eslint/camelcase
                //     beam_middle_rests_only: false,
                //     //groups: [[3,4], [1,1]],
                //     // eslint-disable-next-line @typescript-eslint/camelcase
                //     maintain_stem_directions: false
                // },
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

        const result = await (await fetch(this.url)).text();
        return result;
    }

    public async init() {
        if (!this.url) throw new Error("URL not found. Aborting load");
        this.canvas.innerHTML = "";

        this.osmd.setLogLevel("warn");

        await this.osmd.load(await this.getMusicXml());

        this.osmd.TransposeCalculator = new TransposeCalculator();

        this.osmd.Sheet.Transpose = this.transposition;

        this.osmd.updateGraphic();

        this.osmd.zoom = this.zoom;

        this.osmd.render();

        this.osmd.enableOrDisableCursor(true);

        this.osmd.cursor.cursorElement.style.zIndex = "100";
        
        // this.osmd.cursor.reset();

        this.playbackControl.initialize();
    }

    public rerender() {
        this.disable();
        if (this.osmd?.IsReadyToRender()) {
            this.osmd.zoom = this.zoom;
            this.osmd.render();
            this.osmd.enableOrDisableCursor(true);
            this.osmd.cursor.cursorElement.style.zIndex = "100";
        }
        this.enable();
    }

    public transpose(n: number) {
        this.transposition = n;

        this.osmd.Sheet.Transpose = this.transposition;

        this.osmd.updateGraphic();

        this.osmd.enableOrDisableCursor(true);

        this.osmd.cursor.cursorElement.style.zIndex = "100";
        
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
                console.log("reset");},
            bpmChanged() {
                console.log("bpm");},
            volumeChanged() {
                console.log("volume");},
            volumeMute() {
                console.log("volume");},
            volumeUnmute() {
                console.log("volume");}
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

        function clear() {
            playbackControlPanel.hideAndClear();
            playbackManager.Dispose();
            timingSource.reset();
        }

        function IsClosed() {
            return playbackControlPanel.IsClosed;
        }

        function toggleControls() {
            if (IsClosed()) {
                showControls();
            } else {
                hideControls();
            }
        }

        return { 
            initialize: initialize,
            showControls: showControls,
            hideControls: hideControls,
            IsClosed: IsClosed,
            clear,
            toggleControls
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

body {
    --mdc-theme-primary: #eb6201;
    --mdc-theme-secondary:  #eb6201;
}
/* tooltip styles. Unused for now - Perhaps remove if it remains so */
[data-md-tooltip] {
position: relative;
}
[data-md-tooltip]:before {
    content: attr(data-md-tooltip);
    position: absolute;
    bottom: 8px;
    left: 50%;
    padding: 1px 8px;
    transform: translateX(-50%) scale(0);
    transition: transform 0.3s ease-in-out;
    transition-delay: 0.7s;
    transform-origin: top;
    background: #616161;
    color: white;
    border-radius: 2px;
    font-size: 12px;
    font-family: Roboto,sans-serif;
    font-weight: 400;
    z-index: 99999;
}
.mdc-tab--active[data-md-tooltip]:before {
    background: var(--mdc-theme-primary);
}
[data-md-tooltip]:hover:before {
transform: translateX(-50%) scale(1); 
}
/* POSITIONING */

.left {
    text-align: left;
  }
  
  .right {
    text-align: right;
  }
  
  .center {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  
  .justify {
    text-align: justify;
  }

  .d-inline-block{
      display: inline-block;
  }

  .d-block{
      display: block;
  }

  .d-inline{
      display: inline;
  }

  .d-none{
      display: none;
  }

  .v-align-middle{
      vertical-align: middle;
  }

  .v-align-top{
      vertical-align: top;
  }

  .v-align-bottom{
      vertical-align: bottom;
  }
  
  /* ==== GRID SYSTEM ==== */
  
  .container {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .row {
    position: relative;
    width: 100%;
  }
  
  .row [class^="col"] {
    float: left;
    margin: 0.5rem 2%;
    min-height: 0.125rem;
  }

.col-1 {
    width: 6.3333%;
}

.col-2 {
    width: 14.6666%;
}

.col-3 {
    width: 23%;
}

.col-4 {
    width: 31.3333%;
}

.col-5 {
    width: 39.6666%;
}

.col-6 {
    width: 48%;
}

.col-7 {
    width: 56.3333%;
}

.col-8 {
    width: 64.6666%;
}

.col-9 {
    width: 73%;
}

.col-10 {
    width: 81.3333%;
}

.col-11 {
    width: 89.6666%;
}

.col-12 {
    width: 98%;
}

.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12{
    display: inline-block;
}

.mdc-touch-target-wrapper{
    z-index: 99;
}
.annotation-ui-container{
    font-family: 'Roboto', sans-serif;
}

.toolbar{
    padding: 8px;
    border-bottom: solid 1px #888888;
}

.text-center{
    text-align: center;
}

.half-container{
    display: inline-block;
    width: 49.2%;
    vertical-align: middle;
}

.settings-button-container{
    position:fixed;
    bottom: 15px;
    left: 5px;
    z-index: 50;
}

.settings-button-container .mdc-fab{
    margin-left: 5px;
    margin-right: 5px;
}

.control-panel{
    position:fixed;
    bottom: 60px;
    left: 0;
    padding: 0 5px;
    width: 100%;
    overflow: hidden;
    background: transparent;
}

.controls-container{
    width: 350px;
}

.playback-title-bar{
    margin-bottom: 8px;
}

.controls-container .volume-toolbar, .controls-container .metronome-toolbar{
    padding-left: 10px;
    padding-right: 10px;
}

.controls-container .metronome-toolbar{
    margin-top: 10px;
}

.controls-container .mdc-button.mdc-button--outlined {
    height: 28px;
    padding: 0px;
}

.controls-container .mdc-button.mdc-button--outlined.mdc-icon-button--on .mdc-button__ripple{
    background-color: rgba(241, 154, 92, 0.25);
    transition: background-color 0.5s ease;
}

.playback-buttons{
    bottom: 5px;
    left: calc(50% - 56px);
}

.playpause-button .pause-icon {
    display: none;
}

.playpause-button.playing .pause-icon {
    display:block;
}

.playpause-button.playing .play-icon {
    display:none;
}

.slider-container{
    margin-left: 10px;
}

.annotation-menu{
    position:fixed;
    bottom: 60px;
    left: 5px;
    width: 375px;
    max-width: 90%;
    overflow-x: hidden;
    background-color: #FFFFFF;
}

.preview-container{
    position: fixed;
    bottom: 60px;
    left: 385px;
    width: 90px;
    height: 90px;
    max-width: 10%;
    background-color: #FFFFFF;
}

.preview-container > #render-element{
    text-align: center;
    width: 100%;
    line-height: 1.5;
    margin-top: 38px;
    max-height: 100%;
}

.hide {
    visibility: hidden !important;
    display: none !important;
    transition: display 0.5s ease;
    transition: visibility 0.5s ease;
}

.comment-input-dragger, .symbol-placer-dragger{
    font-size: 1.25rem;
    cursor: pointer;
    z-index: 999;
    vertical-align: top;
}

.comment-input {
    background-color: rgba(255, 255, 128, .4);
    border: dotted 1px blue;
    resize: none;
    overflow: hidden;
    font-family: Times New Roman;
    line-height: 1.1;
    z-index: 1000;
}

.mdc-tab-scroller__scroll-content{
    overflow-y: hidden;
}

#add-symbol-mode{
    overflow-y: hidden;
}

.gonville-icon{
    font-family: Gonville;
    max-height: 100%;
    margin-top: -18px;
}
/*Special rules for custom SVG icon*/
.symbol-icon-group{
    fill: var(--mdc-theme-text-secondary-on-background);
    stroke: var(--mdc-theme-text-secondary-on-background);
}

.mdc-tab--active .symbol-icon-group{
    fill: var(--mdc-theme-primary);
    stroke: var(--mdc-theme-primary);
}

.gonville-icon div span{
    padding: 0px 2px;
}

.symbol-render{
    font-family: Gonville;
    display: inline-block;
    z-index: 1000;
    line-height: 1;
}

.symbol-render-measure{
    position: absolute;
    visibility: hidden;
    font-family: Gonville;
    display: inline-block;
    z-index: -99999;
    line-height: 1;
}

.comment-input:focus {
    border-width: 2px;
    outline: none;
    outline-offset: 0px;
}

#text-measure-element{
    position: absolute;
    visibility: hidden;
    line-height: 1;
    z-index: -99999;
}

#dragger-measure-element{
    font-size: 1.25rem;
    position: absolute;
    visibility: hidden;
    z-index: -99999;
}

#text-measure-element.symbol{
    font-family: Gonville;
}

.color-swatch-list {
    display: inline-block;
    overflow-x: hidden;
    white-space: nowrap;
    margin: 0;
    font: inherit;
    vertical-align: baseline;
    list-style: none;
}

.color-swatch-list .color-swatch{
    display: inline-block;
    border: 0;
    vertical-align: baseline;
    color: #fff;
    cursor: pointer;
    outline: 0;
    position: relative;
    width: 28px;
    height: 28px;
    margin: 2px;
    list-style-type: none;
    transition: border-width 0.6s linear;
}

.color-swatch-list .color-swatch.selected{
    outline: 2px solid;
}

.color-swatch-list .color-swatch.selected{
    outline-color: #000000;
}

.color-swatch-list .color-swatch.selected.negative{
    outline-color: #666666;
}

.symbol-swatch-list .symbol-swatch.selected{
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 80px;
}

.symbol-swatch-list .symbol-swatch, .preview-container > #render-element, .gonville-icons{
    font-family: Gonville;
}

.layer-list-item{
    border-bottom: 1px solid #666666;
    font-weight: bold;
    color: #333333;
    cursor: pointer;
    transition: background-color 0.5s ease;
}

.layer-list-item .text-content{
    padding-top: 15px;
    padding-bottom: 15px;
}

.layer-list-item:hover{
    background-color: rgba(0,0,0,0.05);
}

.layer-list-item.selected {
    background-color: #eb620160;
}

.layer-list-item .mdc-icon-button, .add-layer-controls-container .mdc-icon-button{
    float: right;
}

.layer-list-item .list-buttons {
    z-index: 50;
}

.splide{
    padding: 2rem 3rem;
}

.splide.vertical{
    padding: 3.5rem 2rem;
}

.splide.splide.vertical .splide__list{
    border-top: 1px solid #666666;
}

.splide.vertical .splide__list{
    width: 100%;
}

.splide__arrow{
    z-index: 20;
}

.splide__pagination__page{
    background-color: #aaa;
}

.splide__pagination__page.is-active {
    background-color: #ccc;
}
</style>

