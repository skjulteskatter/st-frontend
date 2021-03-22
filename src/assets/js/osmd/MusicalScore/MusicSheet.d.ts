import { Fraction } from "../Common/DataObjects/Fraction";
import { MusicPartManager } from "./MusicParts/MusicPartManager";
import { SourceMeasure } from "./VoiceData/SourceMeasure";
import { Repetition } from "./MusicSource/Repetition";
import { DynamicsContainer } from "./VoiceData/HelperObjects/DynamicsContainer";
import { InstrumentalGroup } from "./InstrumentalGroup";
import { Instrument } from "./Instrument";
import { Label } from "./Label";
import { Staff } from "./VoiceData/Staff";
import { Voice } from "./VoiceData/Voice";
import { MusicSheetErrors } from "../Common/DataObjects/MusicSheetErrors";
import { MultiTempoExpression } from "./VoiceData/Expressions/MultiTempoExpression";
import { EngravingRules } from "./Graphical/EngravingRules";
import { Dictionary } from "typescript-collections";
import { PlaybackEntry } from "./Playback/PlaybackEntry";
import { PlaybackSettings } from "../Common/DataObjects/PlaybackSettings";
/**
 * This is the representation of a complete piece of sheet music.
 * It includes the contents of a MusicXML file after the reading.
 * Notes: the musicsheet might not need the Rules, e.g. in the testframework. The EngravingRules Constructor
 * fails when no FontInfo exists, which needs a TextMeasurer
 */
export declare class MusicSheet {
    constructor();
    static defaultTitle: string;
    userStartTempoInBPM: number;
    pageWidth: number;
    private idString;
    private sourceMeasures;
    private repetitions;
    private dynListStaves;
    private timestampSortedDynamicExpressionsList;
    private timestampSortedTempoExpressionsList;
    private instrumentalGroups;
    /** The parts in the sheet, e.g. piano left hand, or piano right hand, or violin. */
    private instruments;
    private playbackSettings;
    private path;
    private title;
    private subtitle;
    private composer;
    private lyricist;
    private musicPartManager;
    private musicSheetErrors;
    private staves;
    private playbackDataDict;
    private selectionStart;
    private selectionEnd;
    private transpose;
    private defaultStartTempoInBpm;
    private drawErroneousMeasures;
    private hasBeenOpenedForTheFirstTime;
    private currentEnrolledPosition;
    private rules;
    private hasBPMInfo;
    /**
     * Get the global index within the music sheet for this staff.
     * @param staff
     * @returns {number}
     */
    static getIndexFromStaff(staff: Staff): number;
    get SourceMeasures(): SourceMeasure[];
    set SourceMeasures(value: SourceMeasure[]);
    get Repetitions(): Repetition[];
    set Repetitions(value: Repetition[]);
    get DynListStaves(): DynamicsContainer[][];
    get TimestampSortedTempoExpressionsList(): MultiTempoExpression[];
    get TimestampSortedDynamicExpressionsList(): DynamicsContainer[];
    get InstrumentalGroups(): InstrumentalGroup[];
    get Parts(): Instrument[];
    get Instruments(): Instrument[];
    get SheetPlaybackSetting(): PlaybackSettings;
    set SheetPlaybackSetting(value: PlaybackSettings);
    get DrawErroneousMeasures(): boolean;
    set DrawErroneousMeasures(value: boolean);
    get HasBeenOpenedForTheFirstTime(): boolean;
    set HasBeenOpenedForTheFirstTime(value: boolean);
    InitializeStartTempoInBPM(startTempo: number): void;
    get DefaultStartTempoInBpm(): number;
    set DefaultStartTempoInBpm(value: number);
    get Path(): string;
    set Path(value: string);
    get Staves(): Staff[];
    get TitleString(): string;
    set TitleString(value: string);
    get SubtitleString(): string;
    set SubtitleString(value: string);
    get ComposerString(): string;
    set ComposerString(value: string);
    get LyricistString(): string;
    set LyricistString(value: string);
    get Title(): Label;
    set Title(value: Label);
    get Subtitle(): Label;
    set Subtitle(value: Label);
    get Composer(): Label;
    set Composer(value: Label);
    get Lyricist(): Label;
    set Lyricist(value: Label);
    get Rules(): EngravingRules;
    set Rules(value: EngravingRules);
    get SheetErrors(): MusicSheetErrors;
    get PlaybackDataDict(): Dictionary<Voice, {
        enrolledTimestamp: Fraction;
        playbackEntry: PlaybackEntry;
    }[]>;
    get SelectionStart(): Fraction;
    set SelectionStart(value: Fraction);
    get SelectionEnd(): Fraction;
    set SelectionEnd(value: Fraction);
    set HasBPMInfo(value: boolean);
    get HasBPMInfo(): boolean;
    addMeasure(measure: SourceMeasure): void;
    checkForInstrumentWithNoVoice(): void;
    /**
     *
     * @param staffIndexInMusicSheet - The global staff index, iterating through all staves of all instruments.
     * @returns {Staff}
     */
    getStaffFromIndex(staffIndexInMusicSheet: number): Staff;
    fillStaffList(): void;
    get MusicPartManager(): MusicPartManager;
    set MusicPartManager(value: MusicPartManager);
    getCompleteNumberOfStaves(): number;
    /**
     * Return a sourceMeasureList, where the given indices correspond to the whole SourceMeasureList of the MusicSheet.
     * @param start
     * @param end
     * @returns {SourceMeasure[]}
     */
    getListOfMeasuresFromIndeces(start: number, end: number): SourceMeasure[];
    /**
     * Returns the next SourceMeasure from a given SourceMeasure.
     * @param measure
     */
    getNextSourceMeasure(measure: SourceMeasure): SourceMeasure;
    /**
     * Returns the first SourceMeasure of MusicSheet.
     */
    getFirstSourceMeasure(): SourceMeasure;
    /**
     * Returns the last SourceMeasure of MusicSheet.
     */
    getLastSourceMeasure(): SourceMeasure;
    resetAllNoteStates(): void;
    getMusicSheetInstrumentIndex(instrument: Instrument): number;
    getGlobalStaffIndexOfFirstStaff(instrument: Instrument): number;
    /**
     * Set to the index-given Repetition a new (set from user) value.
     * @param index
     * @param value
     */
    setRepetitionNewUserNumberOfRepetitions(index: number, value: number): void;
    /**
     * Return the [[Repetition]] from the given index.
     * @param index
     * @returns {any}
     */
    getRepetitionByIndex(index: number): Repetition;
    CompareTo(other: MusicSheet): number;
    getExpressionsStartTempoInBPM(): number;
    get Errors(): {
        [n: number]: string[];
    };
    get FirstMeasureNumber(): number;
    get LastMeasureNumber(): number;
    get CurrentEnrolledPosition(): Fraction;
    set CurrentEnrolledPosition(value: Fraction);
    get Transpose(): number;
    set Transpose(value: number);
    get FullNameString(): string;
    get IdString(): string;
    set IdString(value: string);
    getEnrolledSelectionStartTimeStampWorkaround(): Fraction;
    get SheetEndTimestamp(): Fraction;
    /**
     * Works only if the [[SourceMeasure]]s are already filled with VerticalStaffEntryContainers!
     * @param timeStamp
     * @returns {SourceMeasure}
     */
    getSourceMeasureFromTimeStamp(timeStamp: Fraction): SourceMeasure;
    findSourceMeasureFromTimeStamp(timestamp: Fraction): SourceMeasure;
    getVisibleInstruments(): Instrument[];
}
