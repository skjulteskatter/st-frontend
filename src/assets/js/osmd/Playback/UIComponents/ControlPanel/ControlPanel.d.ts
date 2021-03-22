import { AUIController } from "../../../MusicalScore/Interfaces/AUIController";
import { IPlaybackParametersListener } from "../../../Common/Interfaces/IPlaybackParametersListener";
export declare class ControlPanel extends AUIController<IPlaybackParametersListener> implements IPlaybackParametersListener {
    volumeMute(instrument: number): void;
    volumeUnmute(instrument: number): void;
    bpmChanged(newNpm: number): void;
    volumeChanged(channels: number, newVolume: number): void;
    play(): void;
    pause(): void;
    reset(): void;
    private controlPanelElement;
    private playbackButtonsContainerElement;
    private metronomeToolbarElement;
    private volumeToolbarElement;
    private bpmValue;
    private bpmSlider;
    private volumeSliders;
    private volumeSliderElements;
    private playPauseButton;
    private resetButton;
    private titleContentElement;
    private closeButtonElement;
    get IsClosed(): boolean;
    clearVolumeTracks(): void;
    addVolumeTrack(name: string, id: number, value?: number): void;
    protected initialize(): void;
    hideAndClear(): void;
    show(): void;
}
