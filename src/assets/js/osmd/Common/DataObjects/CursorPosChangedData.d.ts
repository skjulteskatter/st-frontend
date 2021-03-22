import { Fraction } from "./Fraction";
import { IRepetition } from "../Interfaces/IRepetition";
export declare class CursorPosChangedData {
    constructor(currentMeasureIndex?: number, currentRepetition?: IRepetition, currentRepetitionIteration?: number, predictedPosition?: Fraction, beatsPerMinute?: number);
    ResetOccurred: boolean;
    CurrentMeasureIndex: number;
    CurrentRepetition: IRepetition;
    CurrentRepetitionIteration: number;
    PredictedPosition: Fraction;
    CurrentBpm: number;
}
