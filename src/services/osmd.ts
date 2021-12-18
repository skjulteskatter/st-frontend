/* eslint-disable */
import { 
    // BasicAudioPlayer, 
    // ControlPanel, 
    // IAudioMetronomePlayer, 
    // IMessageViewer, 
    // LinearTimingSource, 
    OpenSheetMusicDisplay, 
    // PlaybackManager, 
    TransposeCalculator 
} from "opensheetmusicdisplay";
import { SheetMusicOptions } from "songtreasures";
import { logs } from "./logs";
// const timingSource = new LinearTimingSource();
// const playbackManager = new PlaybackManager(timingSource, undefined as any, new BasicAudioPlayer(), undefined as any);
// playbackManager.DoPlayback = true;
// playbackManager.DoPreCount = false;

class OSMD {
    private initialized = false;
    private osmd: OpenSheetMusicDisplay = {} as OpenSheetMusicDisplay;
    public canvas: HTMLElement = {} as HTMLElement;
    // public pbcanvas: HTMLElement = {} as HTMLElement;
    public originalKey?: string;
    public transposition = 0;
    private initialZoom?: number;
    public zoom = 1;
    public createdDone = false;
    public loading = false;

    public clef?: string;
    // public playing = false;

    // private controlPanel: ControlPanel = {} as ControlPanel;
    // private timingSource = timingSource;
    // private playbackManagerCreator = () => new PlaybackManager(this.timingSource, undefined as unknown as IAudioMetronomePlayer, this.audioPlayer, undefined as unknown as IMessageViewer);
    // private playbackManager = {} as PlaybackManager;

    constructor() {
        this.zoom = this.initialZoom != undefined ? this.initialZoom : window.innerWidth < 900 ? 0.4 : this.zoom;
    }

    public async init(c: HTMLElement | null, pbc: HTMLElement | null) {

        if (this.initialized) {
            console.log("ALREADY INITIALIZED")
            return;
        }
        let canvas = c;
        // let pbcanvas = pbc;

        while(!canvas) {
            canvas = document.getElementById("osmd-canvas");
            // pbcanvas = document.getElementById("pb-canvas");

            console.log("COULDN'T FIND ELEMENTS")

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (canvas) {
            this.canvas = canvas;
            // this.pbcanvas = pbcanvas;
            
            this.osmd = new OpenSheetMusicDisplay(this.canvas, {
                autoResize: true,
                backend: "canvas",
                drawingParameters: "default", // try compact (instead of default)
                drawPartNames: false, // try false
                drawTitle: false,
                drawSubtitle: false,
                drawComposer: false,
                drawLyricist: false,
                drawCredits: false,
                disableCursor: false,
                // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
                setWantedStemDirectionByXml: false, // try false, which was previously the default behavior
                // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.
                drawUpToMeasureNumber: Number.MAX_SAFE_INTEGER,
                drawFromMeasureNumber: 0,

                //drawMeasureNumbers: false, // disable drawing measure numbers
                measureNumberInterval: 4, // draw measure numbers only every 4 bars (and at the beginning of a new system)
                useXMLMeasureNumbers: true, // read measure numbers from xml

                // coloring options
                //coloringEnabled: true,
                // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
                // defaultColorStem: "#BB0099",
                defaultFontFamily: "Inter",

                drawPartAbbreviations: true,
                drawSlurs: true,
                percussionOneLineCutoff: 4,

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
                drawHiddenNotes: true,
                pageBackgroundColor: "#FFFFFF",
                newSystemFromXML: true,
                stretchLastSystemLine: true,
                //pageFormat: "A4 P"
            });

            // this.playbackManager = new PlaybackManager(this.timingSource, undefined as any, new BasicAudioPlayer(), undefined as any);

            // this.playbackManager.DoPlayback = true;
            // this.playbackManager.DoPreCount = false;

            // this.controlPanel = new ControlPanel(this.pbcanvas);
            // const o = this.osmd;

            // const playbackListener = {
            //     async play() {
            //         console.log("PLAY");
            //         o.FollowCursor = true;
            //         o.cursor.cursorElement.style.zIndex = "100";
            //     },
            //     async pause() {
            //         console.log("pause");
            //     },
            //     async reset() {
            //         console.log("reset");
            //     },
            //     async bpmChanged() {
            //         console.log("bpm");
            //     },
            //     async volumeChanged() {
            //         console.log("volume");
            //     },
            //     async volumeMute() {
            //         console.log("volume");
            //     },
            //     async volumeUnmute() {
            //         console.log("volume");
            //     }
            // }

            // this.controlPanel.addListener(playbackListener);
            // this.controlPanel.addListener(this.playbackManager);

            // console.log("INITIALIZED OSMD");

            this.initialized = true;

        } else {
            throw new Error("Couldn't get the canvas for OSMD")
        }
    }

    public async load(sheetMusic: SheetMusicOptions) {
        this.loading = true;
        if (!sheetMusic.url) throw new Error("URL not found. Aborting load");

        while(!this.initialized) {
            console.log("WAITING INITIALIZATION")
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.canvas.style.opacity = "0.6";

        this.transposition = sheetMusic.transposition ?? 0;

        if (this.transposition > 6) {
            this.transposition -= 12;
        } else {
            if (this.transposition < -6) {
                this.transposition += 12;
            }
        }

        if (process.env.NODE_ENV == "development")
            this.osmd.setLogLevel("debug");

        this.clef = sheetMusic.clef;

        this.osmd.setOptions({
            onXMLRead: (e) => {

                console.log(sheetMusic.clef);

                if (sheetMusic.clef == "bass") {
                    e = e
                        .replace(/<sign>G<\/sign>/g, '<sign>F</sign>')
                        .replace(/<line>2<\/line>/g, '<line>4</line>');
                }
                
                if (sheetMusic.clef == "alto") {
                    e = e
                        .replace(/<sign>G<\/sign>/g, '<sign>C</sign>')
                        .replace(/<line>2<\/line>/g, '<line>3</line>');
                }

                return e;
            }
        })
        
        await this.osmd.load(sheetMusic.url);

        this.osmd.TransposeCalculator = new TransposeCalculator();

        this.osmd.Sheet.Transpose = sheetMusic.clef == "bass" ? this.transposition - 12 : this.transposition;

        this.osmd.updateGraphic();

        this.osmd.zoom = this.zoom;

        this.osmd.render();
        
        // this.osmd.enableOrDisableCursors(true);
        
        // this.osmd.cursor.reset();

        // (window as any).osmd = this.osmd;

        // await this.loadPlaybackManager();
        this.canvas.style.opacity = "1";
        this.loading = false;
    }

    public rerender() {
        this.disable();
        if (this.osmd?.IsReadyToRender()) {
            this.osmd.zoom = this.zoom;
            this.osmd.render();
            this.osmd.enableOrDisableCursors(true);
            this.osmd.cursor.cursorElement.style.zIndex = "100";
        }
        this.enable();
    }

    public disable() {
        this.canvas.style.opacity = "0.4";
    }

    public enable() {
        this.canvas.style.opacity = "";
    }

    public increaseOctave() {
        this.osmd.Sheet.Transpose = this.osmd.Sheet.Transpose + 12;
        this.osmd.updateGraphic();
        this.rerender();
    }

    public decreaseOctave() {
        this.osmd.Sheet.Transpose = this.osmd.Sheet.Transpose - 12;
        this.osmd.updateGraphic();
        this.rerender();
    }

    public transpose(n: number) {
        this.transposition = n;

        if (this.transposition > 6) {
            this.transposition -= 12;
        } else {
            if (this.transposition < -6) {
                this.transposition += 12;
            }
        }

        this.osmd.Sheet.Transpose = this.clef == "bass" ? this.transposition - 12 : this.transposition;

        this.osmd.updateGraphic();

        this.osmd.enableOrDisableCursors(true);

        this.osmd.cursor.cursorElement.style.zIndex = "100";
        
        this.rerender();
    }

    // public showControls() {
    //     this.controlPanel.show();
    // }

    // public hideControls() {
    //     this.controlPanel.hideAndClear();
    // }

    // public toggleControls() {
    //     if (this.controlPanel.IsClosed) {
    //         this.showControls();
    //     } else {
    //         this.hideControls();
    //     }
    // }

    // public clear() {
    //     this.hideControls();
    //     this.controlPanel.clearVolumeTracks();
    //     this.timingSource.pause();
    //     this.timingSource.reset();
    // }

    // private async loadPlaybackManager() {
    //     this.osmd.FollowCursor = true;
    //     this.timingSource.reset();
    //     this.timingSource.pause();
    //     this.timingSource.Settings = this.osmd.Sheet.SheetPlaybackSetting;
    //     // this.playbackManager.Dispose();

    //     // this.playbackManager = this.playbackManagerCreator();

    //     playbackManager.initialize(this.osmd.Sheet.MusicPartManager);
    //     playbackManager.addListener(this.osmd.cursor);
    //     playbackManager.reset();
    //     this.osmd.PlaybackManager = playbackManager;

    //     this.playbackManager = playbackManager;

    //     this.controlPanel.addListener(playbackManager);
    //     this.controlPanel.clearVolumeTracks();
    //     this.controlPanel.addVolumeTrack(this.playbackManager.Metronome.Name, this.playbackManager.Metronome.Id, this.playbackManager.Metronome.Volume*100);
    //     for(const instrId of this.playbackManager.InstrumentIdMapping.keys()) {
    //         const instr = this.playbackManager.InstrumentIdMapping.getValue(instrId);
    //         if (!instr) continue;
    //         this.controlPanel.addVolumeTrack(instr.Name, instrId, instr.Volume * 100);
    //     }
    //     this.controlPanel.bpmChanged(this.osmd.Sheet.DefaultStartTempoInBpm);
    //     this.loading = false;
    // }

    // public play() {
    //     playbackManager.play();
    //     this.playing = true;
    //     this.osmd.FollowCursor = true;
    //     this.osmd.cursor.cursorElement.style.zIndex = "100";
    // }

    // public pause() {
    //     playbackManager.pause();
    //     this.playing = false;
    // }

    // public reset() {
    //     playbackManager.reset();
    // }
}

export const osmd = new OSMD();
