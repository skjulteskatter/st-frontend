import { MusicSheet } from "../MusicSheet";
import { PartListEntry } from "../MusicSource/PartListEntry";
import { Repetition } from "../MusicSource/Repetition";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { MusicPartManagerIterator } from "./MusicPartManagerIterator";
export declare class MusicPartManager {
    constructor(musicSheet: MusicSheet);
    private parts;
    private timestamps;
    private musicSheet;
    private sheetStart;
    private sheetEnd;
    /**
     * This method is called from CoreContainer when the user changes a Repetitions's userNumberOfRepetitions.
     */
    reInit(): void;
    /**
     * Main initialize method for MusicPartManager.
     */
    init(): void;
    getCurrentRepetitionTimestampTransform(curEnrolledTimestamp: Fraction): TimestampTransform;
    absoluteEnrolledToSheetTimestamp(timestamp: Fraction): Fraction;
    get Parts(): PartListEntry[];
    get MusicSheet(): MusicSheet;
    getIterator(start?: Fraction): MusicPartManagerIterator;
    setSelectionStart(beginning: Fraction): void;
    setSelectionRange(start: Fraction, end: Fraction): void;
    private calcMapping;
}
export declare class TimestampTransform {
    constructor(sourceTimestamp: Fraction, enrolledTimestamp: Fraction, repetition: Repetition, curRepetitionIteration: number);
    from: Fraction;
    to: Fraction;
    nextBackJump: Fraction;
    nextForwardJump: Fraction;
    curRepetition: Repetition;
    curRepetitionIteration: number;
}
