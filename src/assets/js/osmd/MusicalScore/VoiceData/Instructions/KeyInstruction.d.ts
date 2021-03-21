import { AbstractNotationInstruction } from "./AbstractNotationInstruction";
import { SourceStaffEntry } from "../SourceStaffEntry";
import { NoteEnum } from "../../../Common/DataObjects/Pitch";
import { AccidentalEnum } from "../../../Common/DataObjects/Pitch";
import { Pitch } from "../../../Common/DataObjects/Pitch";
/**
 * A [[KeyInstruction]] is a key signature denoting which notes are to be sharpened or flattened.
 */
export declare class KeyInstruction extends AbstractNotationInstruction {
    constructor(sourceStaffEntry?: SourceStaffEntry, key?: number, mode?: KeyEnum);
    private static sharpPositionList;
    private static flatPositionList;
    private keyType;
    keyTypeOriginal: number;
    private mode;
    private alteratedNotes;
    /** The halftones this instruction was transposed by, compared to the original. */
    isTransposedBy: number;
    static copy(keyInstruction: KeyInstruction): KeyInstruction;
    static getAllPossibleMajorKeyInstructions(): KeyInstruction[];
    get Key(): number;
    set Key(value: number);
    get Mode(): KeyEnum;
    set Mode(value: KeyEnum);
    get AlteratedNotes(): NoteEnum[];
    private calcAlteratedNotes;
    willAlterateNote(note: NoteEnum): boolean;
    getAlterationForPitch(pitch: Pitch): AccidentalEnum;
    ToString(): string;
    OperatorEquals(key2: KeyInstruction): boolean;
    OperatorNotEqual(key2: KeyInstruction): boolean;
}
export declare class NoteEnumToHalfToneLink {
    constructor(note: NoteEnum, halftone: number);
    note: NoteEnum;
    halfTone: number;
}
export declare enum KeyEnum {
    major = 0,
    minor = 1,
    none = 2,
    dorian = 3,
    phrygian = 4,
    lydian = 5,
    mixolydian = 6,
    aeolian = 7,
    ionian = 8,
    locrian = 9
}
