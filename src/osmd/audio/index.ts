import { BasicAudioPlayer, ControlPanel, IAudioMetronomePlayer, IMessageViewer, LinearTimingSource, OpenSheetMusicDisplay, PlaybackManager } from "@/assets/js/osmd";

var demoPlaybackControl = function(osmd: OpenSheetMusicDisplay) {

    var playbackListener = {
        play() {
            followCursorCheckbox.checked = true;
            openSheetMusicDisplay.FollowCursor = true;
        },
        pause() {},
        reset() {},
        bpmChanged() {},
        volumeChanged() {},
        volumeMute() {},
        volumeUnmute() {}
    }

    var timingSource = new LinearTimingSource();
    var playbackManager = new PlaybackManager(timingSource, undefined as unknown as IAudioMetronomePlayer, new BasicAudioPlayer(), undefined as unknown as IMessageViewer);
    playbackManager.DoPlayback = true;
    playbackManager.DoPreCount = false;
    var playbackControlPanel = new ControlPanel();
    playbackControlPanel.addListener(playbackManager);
    playbackControlPanel.addListener(playbackListener);

    function initialize() {
        timingSource.reset();
        timingSource.pause();
        timingSource.Settings = osmd.sheet.playbackSettings;
        playbackManager.initialize(osmd.sheet.musicPartManager);
        playbackManager.addListener(osmd.cursor);
        playbackManager.reset();
        osmd.PlaybackManager = playbackManager;
        playbackControlPanel.clearVolumeTracks();
        playbackControlPanel.addVolumeTrack(playbackManager.Metronome.Name, playbackManager.Metronome.Id, playbackManager.Metronome.Volume*100);
        for(const instrId of playbackManager.InstrumentIdMapping.keys()) {
            const instr = playbackManager.InstrumentIdMapping.getValue(instrId);
            playbackControlPanel.addVolumeTrack(instr.Name, instrId, instr.Volume * 100);
        }
        playbackControlPanel.bpmChanged(osmd.sheet.DefaultStartTempoInBpm);
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
};