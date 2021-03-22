import { Note } from "../VoiceData/Note";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { KeyInstruction } from "../VoiceData/Instructions/KeyInstruction";
import { ClefInstruction } from "../VoiceData/Instructions/ClefInstruction";
import { OctaveEnum } from "../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { AccidentalEnum, Pitch } from "../../Common/DataObjects/Pitch";
import { GraphicalObject } from "./GraphicalObject";
import { GraphicalVoiceEntry } from "./GraphicalVoiceEntry";
import { GraphicalMusicPage } from "./GraphicalMusicPage";
import { EngravingRules } from "./EngravingRules";
/**
 * The graphical counterpart of a [[Note]]
 */
export declare class GraphicalNote extends GraphicalObject {
    constructor(note: Note, parent: GraphicalVoiceEntry, rules: EngravingRules, graphicalNoteLength?: Fraction);
    sourceNote: Note;
    DrawnAccidental: AccidentalEnum;
    graphicalNoteLength: Fraction;
    parentVoiceEntry: GraphicalVoiceEntry;
    numberOfDots: number;
    rules: EngravingRules;
    staffLine: number;
    baseFingeringXOffset: number;
    baseStringNumberXOffset: number;
    Transpose(keyInstruction: KeyInstruction, activeClef: ClefInstruction, halfTones: number, octaveEnum: OctaveEnum): Pitch;
    /**
     * Return the number of dots needed to represent the given fraction.
     * @param fraction
     * @returns {number}
     */
    private calculateNumberOfNeededDots;
    get ParentMusicPage(): GraphicalMusicPage;
    /** Get a GraphicalNote from a Note. Use osmd.rules as the second parameter (instance reference).
     *  Also more easily available via osmd.rules.GNote(note). */
    static FromNote(note: Note, rules: EngravingRules): GraphicalNote;
}
