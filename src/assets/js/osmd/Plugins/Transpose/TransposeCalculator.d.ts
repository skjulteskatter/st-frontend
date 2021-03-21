import { ITransposeCalculator } from "../../MusicalScore/Interfaces";
import { Pitch } from "../../Common/DataObjects";
import { KeyInstruction } from "../../MusicalScore/VoiceData/Instructions";
export declare class TransposeCalculator implements ITransposeCalculator {
    private static keyMapping;
    private static noteEnums;
    transposePitch(pitch: Pitch, currentKeyInstruction: KeyInstruction, halftones: number): Pitch;
    transposeKey(keyInstruction: KeyInstruction, transpose: number): void;
}
