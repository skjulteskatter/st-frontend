export declare enum NoteEnum {
    C = 0,
    D = 2,
    E = 4,
    F = 5,
    G = 7,
    A = 9,
    B = 11
}
/** Describes Accidental types.
 * Do not use the number values of these enum members directly for calculation anymore.
 * To use these for pitch calculation, use pitch.AccidentalHalfTones()
 * or Pitch.HalfTonesFromAccidental(accidentalEnum).
 */
export declare enum AccidentalEnum {
    SHARP = 0,
    FLAT = 1,
    NONE = 2,
    NATURAL = 3,
    DOUBLESHARP = 4,
    DOUBLEFLAT = 5,
    TRIPLESHARP = 6,
    TRIPLEFLAT = 7,
    QUARTERTONESHARP = 8,
    QUARTERTONEFLAT = 9
}
export declare class Pitch {
    static pitchEnumValues: NoteEnum[];
    private static halftoneFactor;
    private static octXmlDiff;
    private octave;
    private fundamentalNote;
    private accidental;
    private frequency;
    private halfTone;
    static getNoteEnumString(note: NoteEnum): string;
    /** This method goes x steps from a NoteEnum on a keyboard.
     * E.g. Two steps to the left (-2) from a D is a B.
     * Two steps to the right from an A is a C. */
    static stepFromNoteEnum(noteEnum: NoteEnum, step: number): [NoteEnum, number];
    /**
     * @param the input pitch
     * @param the number of halftones to transpose with
     * @returns ret[0] = the transposed fundamental.
     * ret[1] = the octave shift (not the new octave!)
     * @constructor
     */
    static CalculateTransposedHalfTone(pitch: Pitch, transpose: number): {
        halftone: number;
        overflow: number;
    };
    static WrapAroundCheck(value: number, limit: number): {
        halftone: number;
        overflow: number;
    };
    static calcFrequency(obj: Pitch | number): number;
    static calcFractionalKey(frequency: number): number;
    static fromFrequency(frequency: number): Pitch;
    static fromHalftone(halftone: number): Pitch;
    static ceiling(halftone: number): NoteEnum;
    static floor(halftone: number): NoteEnum;
    constructor(fundamentalNote: NoteEnum, octave: number, accidental: AccidentalEnum);
    /** Turns an AccidentalEnum into half tone steps for pitch calculation.
     *
     */
    static HalfTonesFromAccidental(accidental: AccidentalEnum): number;
    static AccidentalFromHalfTones(halfTones: number): AccidentalEnum;
    /**
     * Converts AccidentalEnum to a string which represents an accidental in VexFlow
     * Can also be useful in other cases, but has to match Vexflow accidental codes.
     * @param accidental
     * @returns {string} Vexflow Accidental code
     */
    static accidentalVexflow(accidental: AccidentalEnum): string;
    get AccidentalHalfTones(): number;
    get Octave(): number;
    get FundamentalNote(): NoteEnum;
    get Accidental(): AccidentalEnum;
    get Frequency(): number;
    static get OctaveXmlDifference(): number;
    getHalfTone(): number;
    getTransposedPitch(factor: number): Pitch;
    DoEnharmonicChange(): void;
    ToString(): string;
    OperatorEquals(p2: Pitch): boolean;
    OperatorNotEqual(p2: Pitch): boolean;
    OperatorFundamentalGreaterThan(p2: Pitch): boolean;
    OperatorFundamentalLessThan(p2: Pitch): boolean;
    private getHigherPitchByTransposeFactor;
    private getLowerPitchByTransposeFactor;
    private getNextFundamentalNote;
    private getPreviousFundamentalNote;
}
