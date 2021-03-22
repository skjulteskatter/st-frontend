import { Fraction } from "../../Common/DataObjects/Fraction";
import { Repetition } from "../MusicSource/Repetition";
import { DynamicsContainer } from "../VoiceData/HelperObjects/DynamicsContainer";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
import { VoiceEntry } from "../VoiceData/VoiceEntry";
import { Instrument } from "../Instrument";
import { MultiTempoExpression } from "../VoiceData/Expressions/MultiTempoExpression";
import { AbstractExpression } from "../VoiceData/Expressions/AbstractExpression";
import { MusicSheet } from "../MusicSheet";
import { PlaybackSettings } from "../../Common/DataObjects/PlaybackSettings";
export declare class MusicPartManagerIterator {
    constructor(musicSheet: MusicSheet, startTimestamp?: Fraction, endTimestamp?: Fraction);
    backJumpOccurred: boolean;
    forwardJumpOccurred: boolean;
    private musicSheet;
    private currentMappingPart;
    private currentMeasure;
    private currentMeasureIndex;
    private currentPartIndex;
    private currentVoiceEntryIndex;
    private currentDynamicEntryIndex;
    private currentTempoEntryIndex;
    private currentVoiceEntries;
    private currentDynamicChangingExpressions;
    private currentTempoChangingExpression;
    private repetitionIterationCountDictKeys;
    private repetitionIterationCountDictValues;
    private currentRepetition;
    private endReached;
    private frontReached;
    currentTimeStamp: Fraction;
    private currentEnrolledMeasureTimestamp;
    private currentRelativeInMeasureTimestamp;
    private currentVerticalContainerInMeasureTimestamp;
    private jumpResponsibleRepetition;
    private currentBpm;
    private activeDynamicExpressions;
    private activeTempoExpression;
    get EndReached(): boolean;
    get FrontReached(): boolean;
    get CurrentMeasure(): SourceMeasure;
    get CurrentRepetition(): Repetition;
    get CurrentRepetitionIteration(): number;
    get CurrentJumpResponsibleRepetitionIterationBeforeJump(): number;
    get CurrentBpm(): number;
    get CurrentVoiceEntries(): VoiceEntry[];
    get CurrentMeasureIndex(): number;
    get CurrentEnrolledTimestamp(): Fraction;
    get CurrentSourceTimestamp(): Fraction;
    get CurrentRelativeInMeasureTimestamp(): Fraction;
    get JumpOccurred(): boolean;
    get ActiveTempoExpression(): MultiTempoExpression;
    get ActiveDynamicExpressions(): AbstractExpression[];
    get CurrentTempoChangingExpression(): MultiTempoExpression;
    get JumpResponsibleRepetition(): Repetition;
    /**
     * Creates a clone of this iterator which has the same actual position.
     */
    clone(startTimeStamp?: Fraction, endTimeStamp?: Fraction): MusicPartManagerIterator;
    /**
     * Returns the visible voice entries for the provided instrument of the current iterator position.
     * @param instrument
     * Returns: A List of voiceEntries. If there are no entries the List has a Count of 0 (it does not return null).
     */
    CurrentVisibleVoiceEntries(instrument?: Instrument): VoiceEntry[];
    /**
     * Returns the audible voice entries for the provided instrument of the current iterator position.
     * @param instrument
     * Returns: A List of voiceEntries. If there are no entries the List has a Count of 0 (it does not return null).
     */
    CurrentAudibleVoiceEntries(instrument?: Instrument): VoiceEntry[];
    /**
     * Returns the audible dynamics of the current iterator position.
     * Returns: A List of Dynamics. If there are no entries the List has a Count of 0 (it does not return null).
     */
    getCurrentDynamicChangingExpressions(): DynamicsContainer[];
    /**
     * Returns the score following voice entries for the provided instrument of the current iterator position.
     * @param instrument
     * Returns: A List of voiceEntries. If there are no entries the List has a Count of 0
     * (it does not return null).
     */
    CurrentScoreFollowingVoiceEntries(instrument?: Instrument): VoiceEntry[];
    currentPlaybackSettings(): PlaybackSettings;
    moveToNext(): void;
    moveToNextVisibleVoiceEntry(notesOnly: boolean): void;
    private resetRepetitionIterationCount;
    private incrementRepetitionIterationCount;
    private setRepetitionIterationCount;
    private getRepetitionIterationCount;
    private handleRepetitionsAtMeasureBegin;
    private handleRepetitionsAtMeasureEnd;
    private doBackJump;
    private activateCurrentRhythmInstructions;
    private activateCurrentDynamicOrTempoInstructions;
    private recursiveMove;
    /**
     * helper function for moveToNextVisibleVoiceEntry and moveToPreviousVisibleVoiceEntry
     * Get all entries and check if there is at least one valid entry in the list
     * @param notesOnly
     */
    private checkEntries;
    private getVisibleEntries;
    private getAudibleEntries;
    private getScoreFollowingEntries;
    private getVoiceEntries;
}
