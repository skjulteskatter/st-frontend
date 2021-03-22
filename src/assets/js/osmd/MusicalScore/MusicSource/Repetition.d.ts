import { SourceMusicPart } from "./SourceMusicPart";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { MusicSheet } from "../MusicSheet";
import { RepetitionInstruction } from "../VoiceData/Instructions/RepetitionInstruction";
import { PartListEntry } from "./PartListEntry";
export declare class Repetition extends PartListEntry {
    constructor(musicSheet: MusicSheet, virtualOverallRepetition?: boolean);
    startMarker: RepetitionInstruction;
    endMarker: RepetitionInstruction;
    forwardJumpInstruction: RepetitionInstruction;
    private backwardJumpInstructions;
    private endingParts;
    private endingIndexDict;
    private userNumberOfRepetitions;
    private visibles;
    private fromWords;
    private musicSheet2;
    private repetitonIterationOrder;
    private numberOfEndings;
    private virtualOverallRepetition;
    get BackwardJumpInstructions(): RepetitionInstruction[];
    get EndingIndexDict(): {
        [_: number]: RepetitionEndingPart;
    };
    get EndingParts(): RepetitionEndingPart[];
    get Visibles(): boolean[];
    set Visibles(value: boolean[]);
    get DefaultNumberOfRepetitions(): number;
    get UserNumberOfRepetitions(): number;
    set UserNumberOfRepetitions(value: number);
    getForwardJumpTargetForIteration(iteration: number): number;
    getBackwardJumpTarget(): number;
    setEndingsStartIndex(endingNumbers: number[], startIndex: number): void;
    setEndingStartIndex(endingNumber: number, startIndex: number): void;
    setEndingEndIndex(endingNumber: number, endIndex: number): void;
    get NumberOfEndings(): number;
    get FromWords(): boolean;
    set FromWords(value: boolean);
    get AbsoluteTimestamp(): Fraction;
    get StartIndex(): number;
    get EndIndex(): number;
    private checkRepetitionForMultipleLyricVerses;
    get FirstSourceMeasureNumber(): number;
    get LastSourceMeasureNumber(): number;
    coversIdenticalMeasures(other: Repetition): boolean;
    removeFromRepetitionInstructions(): void;
}
export declare class RepetitionEndingPart {
    constructor(endingPart: SourceMusicPart);
    part: SourceMusicPart;
    endingIndices: number[];
    ToString(): string;
}
