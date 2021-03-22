import Vex from "vexflow";
import { GraphicalNote } from "../GraphicalNote";
import { Note } from "../../VoiceData/Note";
import { ClefInstruction } from "../../VoiceData/Instructions/ClefInstruction";
import { Pitch } from "../../../Common/DataObjects/Pitch";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { OctaveEnum } from "../../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
import { KeyInstruction } from "../../VoiceData/Instructions/KeyInstruction";
import { EngravingRules } from "../EngravingRules";
/**
 * The VexFlow version of a [[GraphicalNote]].
 */
export declare class VexFlowGraphicalNote extends GraphicalNote {
    constructor(note: Note, parent: GraphicalVoiceEntry, activeClef: ClefInstruction, octaveShift: OctaveEnum, rules: EngravingRules, graphicalNoteLength?: Fraction);
    octaveShift: OctaveEnum;
    vfpitch: [string, string, ClefInstruction];
    vfnote: [Vex.Flow.StemmableNote, number];
    vfnoteIndex: number;
    private clef;
    /**
     * Update the pitch of this note. Necessary in order to display accidentals correctly.
     * This is called by VexFlowGraphicalSymbolFactory.addGraphicalAccidental.
     * @param pitch
     */
    setAccidental(pitch: Pitch): void;
    drawPitch(pitch: Pitch): Pitch;
    Transpose(keyInstruction: KeyInstruction, activeClef: ClefInstruction, halfTones: number, octaveEnum: OctaveEnum): Pitch;
    /**
     * Set the VexFlow StaveNote corresponding to this GraphicalNote, together with its index in the chord.
     * @param note
     * @param index
     */
    setIndex(note: Vex.Flow.StemmableNote, index: number): void;
    notehead(vfNote?: Vex.Flow.StemmableNote): {
        line: number;
    };
    /**
     * Gets the clef for this note
     */
    Clef(): ClefInstruction;
    /**
     * Gets the id of the SVGGElement containing this note, given the SVGRenderer is used.
     * This is for low-level rendering hacks and should be used with caution.
     */
    getSVGId(): string;
    /**
     * Gets the SVGGElement containing this note, given the SVGRenderer is used.
     * This is for low-level rendering hacks and should be used with caution.
     */
    getSVGGElement(): SVGGElement;
}
