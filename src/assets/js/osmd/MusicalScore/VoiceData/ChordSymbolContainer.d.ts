import { Pitch } from "../../Common/DataObjects/Pitch";
import { KeyInstruction } from "./Instructions/KeyInstruction";
import { AccidentalEnum } from "../../Common/DataObjects/Pitch";
import { EngravingRules } from "../Graphical/EngravingRules";
export declare class ChordSymbolContainer {
    private rootPitch;
    private chordKind;
    private bassPitch;
    private degrees;
    private rules;
    constructor(rootPitch: Pitch, chordKind: ChordSymbolEnum, bassPitch: Pitch, chordDegrees: Degree[], rules: EngravingRules);
    get RootPitch(): Pitch;
    get ChordKind(): ChordSymbolEnum;
    get BassPitch(): Pitch;
    get ChordDegrees(): Degree[];
    static calculateChordText(chordSymbol: ChordSymbolContainer, transposeHalftones: number, keyInstruction: KeyInstruction): string;
    private static getTextForAccidental;
    private getTextFromChordKindEnum;
}
export declare class Degree {
    constructor(value: number, alteration: AccidentalEnum, text: ChordDegreeText);
    value: number;
    alteration: AccidentalEnum;
    text: ChordDegreeText;
}
export interface DegreesInfo {
    adds?: string[];
    alts?: string[];
    subs?: string[];
}
export declare class CustomChord {
    alternateName: string;
    chordKind: ChordSymbolEnum;
    degrees: DegreesInfo;
    constructor(alternateName: string, chordKind: ChordSymbolEnum, degrees: DegreesInfo);
    static createCustomChord(altName: string, chordKind: ChordSymbolEnum, degrees: DegreesInfo): CustomChord;
    static renameCustomChord(altName: string, newAltName: string, customChords: CustomChord[]): void;
}
export declare enum ChordDegreeText {
    add = 0,
    alter = 1,
    subtract = 2
}
export declare enum ChordSymbolEnum {
    major = 0,
    minor = 1,
    augmented = 2,
    diminished = 3,
    dominant = 4,
    majorseventh = 5,
    minorseventh = 6,
    diminishedseventh = 7,
    augmentedseventh = 8,
    halfdiminished = 9,
    majorminor = 10,
    majorsixth = 11,
    minorsixth = 12,
    dominantninth = 13,
    majorninth = 14,
    minorninth = 15,
    dominant11th = 16,
    major11th = 17,
    minor11th = 18,
    dominant13th = 19,
    major13th = 20,
    minor13th = 21,
    suspendedsecond = 22,
    suspendedfourth = 23,
    Neapolitan = 24,
    Italian = 25,
    French = 26,
    German = 27,
    pedal = 28,
    power = 29,
    Tristan = 30,
    none = 31
}
