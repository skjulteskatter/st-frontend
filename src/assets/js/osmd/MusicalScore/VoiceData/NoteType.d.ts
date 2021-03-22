import { Fraction } from "../../Common/DataObjects/Fraction";
export declare enum NoteType {
    UNDEFINED = 0,
    _1024th = 1,
    _512th = 2,
    _256th = 3,
    _128th = 4,
    _64th = 5,
    _32nd = 6,
    _16th = 7,
    EIGTH = 8,
    QUARTER = 9,
    HALF = 10,
    WHOLE = 11,
    BREVE = 12,
    LONG = 13,
    MAXIMA = 14
}
export declare class NoteTypeHandler {
    static NoteTypeXmlValues: string[];
    static NoteTypeToString(noteType: NoteType): string;
    static StringToNoteType(noteType: string): NoteType;
    /**
     *
     * @param type
     * @returns {Fraction} - a Note's Duration from a given type (type must be valid).
     */
    static getNoteDurationFromType(type: string): Fraction;
}
