import { Fraction } from "../../Common/DataObjects/Fraction";
import { VerticalSourceStaffEntryContainer } from "./VerticalSourceStaffEntryContainer";
import { SourceStaffEntry } from "./SourceStaffEntry";
import { RepetitionInstruction } from "./Instructions/RepetitionInstruction";
import { Staff } from "./Staff";
import { VoiceEntry } from "./VoiceEntry";
import { Voice } from "./Voice";
import { MusicSheet } from "../MusicSheet";
import { MultiExpression } from "./Expressions/MultiExpression";
import { MultiTempoExpression } from "./Expressions/MultiTempoExpression";
import { RehearsalExpression } from "./Expressions/RehearsalExpression";
import { KeyInstruction } from "./Instructions/KeyInstruction";
import { SystemLinesEnum } from "../Graphical/SystemLinesEnum";
import { EngravingRules } from "../Graphical/EngravingRules";
import { GraphicalMeasure } from "../Graphical/GraphicalMeasure";
/**
 * The Source Measure represents the source data of a unique measure, including all instruments with their staves.
 * There exists one source measure per XML measure or per paper sheet measure (e.g. the source measures are not doubled in repetitions)
 */
export declare class SourceMeasure {
    /**
     * The data entries and data lists will be filled with null values according to the total number of staves,
     * so that existing objects can be referred to by staff index.
     * @param completeNumberOfStaves
     * @param rules
     */
    constructor(completeNumberOfStaves: number, rules: EngravingRules);
    /**
     * The unique measure list index starting with 0.
     */
    measureListIndex: number;
    /**
     * The style of the ending bar line.
     */
    endingBarStyleXml: string;
    endingBarStyleEnum: SystemLinesEnum;
    /** Whether the MusicXML says to print a new system (line break). See OSMDOptions.newSystemFromXML */
    printNewSystemXml: boolean;
    /** Whether the MusicXML says to print a new page (page break). See OSMDOptions.newPageFromXML */
    printNewPageXml: boolean;
    IsSystemStartMeasure: boolean;
    private measureNumber;
    MeasureNumberXML: number;
    MeasureNumberPrinted: number;
    RhythmPrinted: boolean;
    multipleRestMeasures: number;
    private absoluteTimestamp;
    private completeNumberOfStaves;
    private duration;
    private activeTimeSignature;
    hasLyrics: boolean;
    hasMoodExpressions: boolean;
    /** Whether the SourceMeasure only has rests, no other entries.
     *  Not the same as GraphicalMeasure.hasOnlyRests, because one SourceMeasure can have many GraphicalMeasures (staffs).
     */
    allRests: boolean;
    isReducedToMultiRest: boolean;
    /** If this measure is a MultipleRestMeasure, this is the number of the measure in that sequence of measures. */
    multipleRestMeasureNumber: number;
    private staffLinkedExpressions;
    private tempoExpressions;
    rehearsalExpression: RehearsalExpression;
    private verticalSourceStaffEntryContainers;
    private implicitMeasure;
    private hasEndLine;
    hasEndClef: boolean;
    private graphicalMeasureErrors;
    private firstInstructionsStaffEntries;
    private lastInstructionsStaffEntries;
    private firstRepetitionInstructions;
    private lastRepetitionInstructions;
    private rules;
    private tempoInBPM;
    private verticalMeasureList;
    get MeasureNumber(): number;
    set MeasureNumber(value: number);
    getPrintedMeasureNumber(): number;
    get AbsoluteTimestamp(): Fraction;
    set AbsoluteTimestamp(value: Fraction);
    get CompleteNumberOfStaves(): number;
    get Duration(): Fraction;
    set Duration(value: Fraction);
    get ActiveTimeSignature(): Fraction;
    set ActiveTimeSignature(value: Fraction);
    get ImplicitMeasure(): boolean;
    set ImplicitMeasure(value: boolean);
    get HasEndLine(): boolean;
    set HasEndLine(value: boolean);
    get StaffLinkedExpressions(): MultiExpression[][];
    get TempoExpressions(): MultiTempoExpression[];
    get VerticalSourceStaffEntryContainers(): VerticalSourceStaffEntryContainer[];
    get FirstInstructionsStaffEntries(): SourceStaffEntry[];
    get LastInstructionsStaffEntries(): SourceStaffEntry[];
    get FirstRepetitionInstructions(): RepetitionInstruction[];
    get LastRepetitionInstructions(): RepetitionInstruction[];
    getErrorInMeasure(staffIndex: number): boolean;
    setErrorInGraphicalMeasure(staffIndex: number, hasError: boolean): void;
    getNextMeasure(measures: SourceMeasure[]): SourceMeasure;
    getPreviousMeasure(measures: SourceMeasure[]): SourceMeasure;
    get Rules(): EngravingRules;
    get VerticalMeasureList(): GraphicalMeasure[];
    set VerticalMeasureList(value: GraphicalMeasure[]);
    get TempoInBPM(): number;
    set TempoInBPM(value: number);
    /**
     * Check at the given timestamp if a VerticalContainer exists, if not creates a new, timestamp-ordered one,
     * and at the given index, if a [[SourceStaffEntry]] exists, and if not, creates a new one.
     * @param inMeasureTimestamp
     * @param inSourceMeasureStaffIndex
     * @param staff
     * @returns {{createdNewContainer: boolean, staffEntry: SourceStaffEntry}}
     */
    findOrCreateStaffEntry(inMeasureTimestamp: Fraction, inSourceMeasureStaffIndex: number, staff: Staff): {
        createdNewContainer: boolean;
        staffEntry: SourceStaffEntry;
    };
    /**
     * Check if a VerticalContainer, a staffEntry and a voiceEntry exist at the given timestamp.
     * If not, create the necessary entries.
     * @param sse
     * @param voice
     * @returns {{createdVoiceEntry: boolean, voiceEntry: VoiceEntry}}
     */
    findOrCreateVoiceEntry(sse: SourceStaffEntry, voice: Voice): {
        createdVoiceEntry: boolean;
        voiceEntry: VoiceEntry;
    };
    /**
     * Search for a non-null [[SourceStaffEntry]] at the given verticalIndex,
     * starting from the given horizontalIndex and moving backwards. If none is found, then return undefined.
     * @param verticalIndex
     * @param horizontalIndex
     * @returns {any}
     */
    getPreviousSourceStaffEntryFromIndex(verticalIndex: number, horizontalIndex: number): SourceStaffEntry;
    /**
     * Return the index of the existing VerticalContainer at the given timestamp.
     * @param musicTimestamp
     * @returns {number}
     */
    getVerticalContainerIndexByTimestamp(musicTimestamp: Fraction): number;
    /**
     * Return the existing VerticalContainer at the given timestamp.
     * @param musicTimestamp
     * @returns {any}
     */
    getVerticalContainerByTimestamp(musicTimestamp: Fraction): VerticalSourceStaffEntryContainer;
    /**
     * Check the [[SourceMeasure]] for a possible VerticalContainer with all of its [[StaffEntry]]s undefined,
     * and if found, remove the VerticalContainer from the [[SourceMeasure]].
     * @param index
     */
    checkForEmptyVerticalContainer(index: number): void;
    /**
     * This method is used for handling a measure with the following error (in the procedure of finding out the Instrument's Duration):
     * If the LastStaffEntry is missing (implied restNote or error), then go back the StaffEntries until you find a TiedNote (tie Start),
     * which gives the correct MeasureDuration.
     * @param musicSheet
     * @param maxInstDuration
     * @returns {Fraction}
     */
    reverseCheck(musicSheet: MusicSheet, maxInstDuration: Fraction): Fraction;
    /**
     * Calculate all the [[Instrument]]'s NotesDurations for this Measures.
     * @param musicSheet
     * @param instrumentMaxTieNoteFractions
     * @returns {Fraction[]}
     */
    calculateInstrumentsDuration(musicSheet: MusicSheet, instrumentMaxTieNoteFractions: Fraction[]): Fraction[];
    getEntriesPerStaff(staffIndex: number): SourceStaffEntry[];
    /**
     *
     * @returns {boolean} true iff some measure begin instructions have been found for at least one staff
     */
    hasBeginInstructions(): boolean;
    beginsWithLineRepetition(): boolean;
    /**
     * Check if this measure is a Repetition Ending.
     * @returns {boolean}
     */
    endsWithLineRepetition(): boolean;
    /**
     * Check if a Repetition starts at the next Measure.
     * @returns {boolean}
     */
    beginsWithWordRepetition(): boolean;
    /**
     * Check if this Measure ends a Repetition.
     * @returns {boolean}
     */
    endsWithWordRepetition(): boolean;
    beginsRepetitionEnding(): boolean;
    endsRepetitionEnding(): boolean;
    getKeyInstruction(staffIndex: number): KeyInstruction;
    /**
     * Return the first non-null [[SourceStaffEntry]] at the given InstrumentIndex.
     * @param instrumentIndex
     * @returns {SourceStaffEntry}
     */
    private getLastSourceStaffEntryForInstrument;
    canBeReducedToMultiRest(): boolean;
}
