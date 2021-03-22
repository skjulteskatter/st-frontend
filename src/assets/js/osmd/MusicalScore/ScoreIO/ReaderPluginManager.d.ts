import { IVoiceMeasureReadPlugin } from "../Interfaces/IVoiceMeasureReadPlugin";
import { VoiceEntry, RhythmInstruction, KeyInstruction } from "../VoiceData";
export declare class ReaderPluginManager {
    private voiceMeasureReadPlugins;
    addVoiceMeasureReadPlugin(plugin: IVoiceMeasureReadPlugin): void;
    processVoiceMeasureReadPlugins(measureVoiceEntries: VoiceEntry[], activeKey: KeyInstruction, currentRhythm: RhythmInstruction): void;
}
