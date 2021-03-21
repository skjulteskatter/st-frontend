import { RepetitionInstruction } from "../../VoiceData/Instructions/RepetitionInstruction";
import { MusicSheet } from "../../MusicSheet";
import { Repetition } from "../../MusicSource";
export declare class RepetitionCalculator {
    private musicSheet;
    private repetitionInstructions;
    private openRepetitions;
    private lastRepetitionCommonPartStartIndex;
    private currentMeasure;
    private currentMeasureIndex;
    /**
     * Is called when all repetition symbols have been read from xml.
     * Creates the repetition instructions and adds them to the corresponding measure.
     * Creates the logical repetition objects for iteration and playback.
     * @param musicSheet
     * @param repetitionInstructions
     */
    calculateRepetitions(musicSheet: MusicSheet, repetitionInstructions: RepetitionInstruction[]): void;
    private handleRepetitionInstructions;
    private findInstructionInMainListBackwards;
    private finalizeRepetition;
    private getCurrentRepetition;
    private getOrCreateCurrentRepetition;
    private getOrCreateCurrentRepetition2;
    private createNewRepetition;
    private getLastFinalizedRepetition;
}
export declare class RepetitionBuildingContainer {
    RepetitonUnderConstruction: Repetition;
    WaitingForCoda: boolean;
    SegnoFound: boolean;
    FineFound: boolean;
    ToCodaFound: boolean;
    CodaFound: boolean;
    constructor(musicSheet: MusicSheet);
}
