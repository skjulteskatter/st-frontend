import { AbstractNotationInstruction } from "./AbstractNotationInstruction";
import { Fraction } from "../../../Common/DataObjects/Fraction";
/**
 * A [[RhythmInstruction]] is the time signature which specifies the number of beats in each bar, and the value of one beat.
 */
export declare class RhythmInstruction extends AbstractNotationInstruction {
    constructor(rhythm: Fraction, rhythmSymbolEnum: RhythmSymbolEnum);
    private numerator;
    private denominator;
    private rhythm;
    private symbolEnum;
    get Rhythm(): Fraction;
    set Rhythm(value: Fraction);
    get SymbolEnum(): RhythmSymbolEnum;
    set SymbolEnum(value: RhythmSymbolEnum);
    clone(): RhythmInstruction;
    OperatorEquals(rhythm2: RhythmInstruction): boolean;
    OperatorNotEqual(rhythm2: RhythmInstruction): boolean;
    ToString(): string;
}
export declare enum RhythmSymbolEnum {
    NONE = 0,
    COMMON = 1,
    CUT = 2
}
