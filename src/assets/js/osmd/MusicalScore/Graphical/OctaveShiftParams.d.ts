import { Fraction } from "../../Common/DataObjects/Fraction";
import { OctaveShift } from "../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
export declare class OctaveShiftParams {
    constructor(openOctaveShift: OctaveShift, absoluteStartTimestamp: Fraction, absoluteEndTimestamp: Fraction);
    getOpenOctaveShift: OctaveShift;
    getAbsoluteStartTimestamp: Fraction;
    getAbsoluteEndTimestamp: Fraction;
}
