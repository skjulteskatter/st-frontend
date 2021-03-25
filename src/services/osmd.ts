import { BasicAudioPlayer, ControlPanel, IAudioMetronomePlayer, IMessageViewer, LinearTimingSource, OpenSheetMusicDisplay, PlaybackManager, TransposeCalculator } from "@/assets/js/osmd";
import { SheetMusicOptions } from "@/store/songs";

class OSMD {
    private osmd: OpenSheetMusicDisplay = {} as OpenSheetMusicDisplay;
    public canvas: HTMLElement = {} as HTMLElement;
    public pbcanvas: HTMLElement = {} as HTMLElement;
    public originalKey?: string;
    public transposition = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public playbackControl: any;
    private initialZoom?: number;
    public zoom = 1;
    public createdDone = false;
    public loading: string[] = [];

    private controlPanel: ControlPanel = {} as ControlPanel;
    private timingSource = new LinearTimingSource();
    private playbackManager = new PlaybackManager(this.timingSource, undefined as unknown as IAudioMetronomePlayer, new BasicAudioPlayer(), undefined as unknown as IMessageViewer);

    constructor() {
        this.zoom = this.initialZoom != undefined ? this.initialZoom : window.innerWidth < 900 ? 0.4 : this.zoom;
        
        const canvas = document.getElementById("osmd-canvas");
        const pbcanvas = document.getElementById("pb-controls");

        this.init(canvas, pbcanvas);
    }

    public async init(canvas: HTMLElement | null, pbcanvas: HTMLElement | null) {
        while(!canvas || !pbcanvas) {
            canvas = document.getElementById("osmd-canvas");
            pbcanvas = document.getElementById("pb-controls");

            await new Promise(resolve => setTimeout(resolve, 100));
        }

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

            this.controlPanel = new ControlPanel(pbcanvas);

            this.playbackControl = this.demoPlaybackControl();

        } else {
            throw new Error("Couldn't get the canvas for OSMD")
        }
    }

    public async load(sheetMusic: SheetMusicOptions) {
        if (!sheetMusic.url) throw new Error("URL not found. Aborting load");

        this.transposition = sheetMusic.transposition ?? 0;

        this.canvas.innerHTML = "";
        this.pbcanvas.innerHTML = "";

        this.osmd.setLogLevel("warn");

        await this.osmd.load(sheetMusic.url);

        this.osmd.TransposeCalculator = new TransposeCalculator();

        this.osmd.Sheet.Transpose = this.transposition;

        this.osmd.updateGraphic();

        this.osmd.zoom = this.zoom;

        this.osmd.render();
        
        this.osmd.enableOrDisableCursor(true);
        
        // this.osmd.cursor.reset();

        this.playbackControl.initialize(this.osmd);

        // this.playbackControl.initialize();
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

    public disable() {
        this.canvas.style.opacity = "0.4";
    }

    public enable() {
        this.canvas.style.opacity = "";
    }

    public transpose(n: number) {
        this.transposition = n;

        this.osmd.Sheet.Transpose = this.transposition;

        this.osmd.updateGraphic();

        this.osmd.enableOrDisableCursor(true);

        this.osmd.cursor.cursorElement.style.zIndex = "100";
        
        this.rerender();
    }

    public demoPlaybackControl() {
        const openSheetMusicDisplay = this.osmd;

        const playbackListener = {
            play() {
                openSheetMusicDisplay.cursor.cursorElement.style.zIndex = "100";
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

        const timingSource = this.timingSource;
        const playbackManager = this.playbackManager;
        playbackManager.DoPlayback = true;
        playbackManager.DoPreCount = false;

        const playbackControlPanel = this.controlPanel;
        playbackControlPanel.addListener(playbackManager);
        playbackControlPanel.addListener(playbackListener);

        function initialize(osmd: OpenSheetMusicDisplay) {
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
            playbackControlPanel.clearVolumeTracks();
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

    private loadPlaybackManager() {
        this.timingSource.reset();
        this.timingSource.pause();
        this.timingSource.Settings = this.osmd.Sheet.SheetPlaybackSetting;
        this.playbackManager.initialize(this.osmd.Sheet.MusicPartManager);
        this.playbackManager.addListener(this.osmd.cursor);
        this.playbackManager.reset();
        this.osmd.PlaybackManager = this.playbackManager;
        this.controlPanel.clearVolumeTracks();
        this.controlPanel.addVolumeTrack(this.playbackManager.Metronome.Name, this.playbackManager.Metronome.Id, this.playbackManager.Metronome.Volume*100);
        for(const instrId of this.playbackManager.InstrumentIdMapping.keys()) {
            const instr = this.playbackManager.InstrumentIdMapping.getValue(instrId);
            if (!instr) continue;
            this.controlPanel.addVolumeTrack(instr.Name, instrId, instr.Volume * 100);
        }
        this.controlPanel.bpmChanged(this.osmd.Sheet.DefaultStartTempoInBpm);
    }
}

export const osmd = new OSMD();