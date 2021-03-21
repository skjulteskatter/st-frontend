import { KeyInstruction } from "../VoiceData/Instructions/KeyInstruction";
import { GraphicalNote } from "./GraphicalNote";
import { Pitch } from "../../Common/DataObjects/Pitch";
/**
 * Compute the accidentals for notes according to the current key instruction
 */
export declare class AccidentalCalculator {
    private keySignatureNoteAlterationsDict;
    private currentAlterationsComparedToKeyInstructionList;
    private currentInMeasureNoteAlterationsDict;
    private activeKeyInstruction;
    get ActiveKeyInstruction(): KeyInstruction;
    set ActiveKeyInstruction(value: KeyInstruction);
    /**
     * This method is called after each Measure
     * It clears the in-measure alterations dict for the next measure
     * and pre-loads with the alterations of the key signature
     */
    doCalculationsAtEndOfMeasure(): void;
    checkAccidental(graphicalNote: GraphicalNote, pitch: Pitch): void;
    private reactOnKeyInstructionChange;
}
