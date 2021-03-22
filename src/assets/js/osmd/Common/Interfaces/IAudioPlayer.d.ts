import { MidiInstrument } from "../../MusicalScore/VoiceData/Instructions/ClefInstruction";
export interface IAudioPlayer<TSoundFont> {
    open(uniqueInstruments: number[], numberOfinstruments: number): void;
    close(): void;
    tuningChanged(tuningInHz: number): void;
    playSound(instrumentChannel: number, key: number, volume: number, lengthInMs: number): void;
    stopSound(instrumentChannel: number, volume: number): void;
    setSound(instrumentChannel: number, soundId: MidiInstrument): Promise<void>;
    setVolume(instrumentChannel: number, volume: number): void;
    /**
     * Sets the file path from where the sound font can be loaded
     * @param soundId Sound identifier
     * @param path File path for loading samples into memory
     */
    setSoundFontFilePath(soundId: MidiInstrument, path: string): void;
    playbackHasStopped(): void;
    loadSoundFont(soundId: MidiInstrument): Promise<TSoundFont>;
    getMemoryLoadedSoundFonts(): TSoundFont[];
}
