import { MidiInstrument } from "..";
import { IAudioPlayer } from "../Common/Interfaces/IAudioPlayer";
import * as SoundfontPlayer from "soundfont-player";
export declare class BasicAudioPlayer implements IAudioPlayer<SoundfontPlayer.Player> {
    private ac;
    private channelVolumes;
    private piano;
    protected memoryLoadedSoundFonts: Map<MidiInstrument, SoundfontPlayer.Player>;
    protected channelToSoundFont: Map<number, number>;
    open(uniqueInstruments: number[], numberOfinstruments?: number): Promise<void>;
    close(): void;
    tuningChanged(tuningInHz: number): void;
    playSound(instrumentChannel: number, key: number, volume: number, lengthInMs: number): void;
    stopSound(instrumentChannel: number, volume: number): void;
    setSound(instrumentChannel: number, soundId: MidiInstrument): Promise<void>;
    loadSoundFont(soundId: MidiInstrument): Promise<SoundfontPlayer.Player>;
    setVolume(instrumentChannel: number, volume: number): void;
    setSoundFontFilePath(soundId: MidiInstrument, path: string): void;
    playbackHasStopped(): void;
    getMemoryLoadedSoundFonts(): SoundfontPlayer.Player[];
}
