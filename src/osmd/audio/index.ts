import { BasicAudioPlayer, ControlPanel, IAudioMetronomePlayer, IMessageViewer, LinearTimingSource, OpenSheetMusicDisplay, PlaybackManager } from "@/assets/js/osmd";

export const PlaybackControl = function(osmd: OpenSheetMusicDisplay, pbcp: HTMLElement) {

    const playbackListener = {
        play() {
            console.log("play")
            osmd.FollowCursor = true;
        },
        pause() {
            console.log("pause");},
        reset() {
            console.log("reset");},
        bpmChanged() {
            console.log("changebpm");},
        volumeChanged() {
            console.log("volume");},
        volumeMute() {
            console.log("mute");},
        volumeUnmute() {
            console.log("unmute");}
    }

    const timingSource = new LinearTimingSource();
    const playbackManager = new PlaybackManager(timingSource, undefined as unknown as IAudioMetronomePlayer, new BasicAudioPlayer(), undefined as unknown as IMessageViewer);
    playbackManager.DoPlayback = true;
    playbackManager.DoPreCount = false;
    const playbackControlPanel = new ControlPanel(pbcp);
    playbackControlPanel.addListener(playbackManager);
    playbackControlPanel.addListener(playbackListener);

    function initialize() {
        timingSource.reset();
        timingSource.pause();
        playbackManager.addListener(osmd.cursor);
        playbackManager.reset();
        osmd.PlaybackManager = playbackManager;
        playbackControlPanel.clearVolumeTracks();
        playbackControlPanel.addVolumeTrack(playbackManager.Metronome.Name, playbackManager.Metronome.Id, playbackManager.Metronome.Volume*100);
        for(const instrId of playbackManager.InstrumentIdMapping.keys()) {
            const instr = playbackManager.InstrumentIdMapping.getValue(instrId);
            if (instr) {
                playbackControlPanel.addVolumeTrack(instr.Name, instrId, instr.Volume * 100);
            }
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
};