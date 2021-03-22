import { MusicSystem } from "./MusicSystem";
import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
import { StaffLine } from "./StaffLine";
import { Staff } from "../VoiceData/Staff";
import { GraphicalObject } from "./GraphicalObject";
import { ClefInstruction } from "../VoiceData/Instructions/ClefInstruction";
import { KeyInstruction } from "../VoiceData/Instructions/KeyInstruction";
import { RhythmInstruction } from "../VoiceData/Instructions/RhythmInstruction";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { SystemLinesEnum } from "./SystemLinesEnum";
/**
 * Represents a measure in the music sheet (one measure in one staff line)
 */
export declare abstract class GraphicalMeasure extends GraphicalObject {
    protected firstInstructionStaffEntry: GraphicalStaffEntry;
    protected lastInstructionStaffEntry: GraphicalStaffEntry;
    constructor(staff?: Staff, parentSourceMeasure?: SourceMeasure, staffLine?: StaffLine);
    parentSourceMeasure: SourceMeasure;
    staffEntries: GraphicalStaffEntry[];
    /**
     * The x-width of possibly existing: repetition start line, clef, key, rhythm.
     */
    beginInstructionsWidth: number;
    /**
     * The minimum possible x-width of all staff entries without overlapping.
     */
    minimumStaffEntriesWidth: number;
    /**
     * Will be set by music system builder while building systems.
     */
    staffEntriesScaleFactor: number;
    /**
     * The x-width of possibly existing: repetition end line, clef.
     */
    endInstructionsWidth: number;
    hasError: boolean;
    /**
     * Whether or not this measure is nothing but rest(s).
     * Also see SourceMeasure.allRests, which is not the same, because a source measure can have multiple staffs/graphicalMeasures.
     */
    hasOnlyRests: boolean;
    private parentStaff;
    private parentMusicSystem;
    private measureNumber;
    private parentStaffLine;
    get ParentStaff(): Staff;
    get ParentMusicSystem(): MusicSystem;
    set ParentMusicSystem(value: MusicSystem);
    get MeasureNumber(): number;
    get FirstInstructionStaffEntry(): GraphicalStaffEntry;
    set FirstInstructionStaffEntry(value: GraphicalStaffEntry);
    get LastInstructionStaffEntry(): GraphicalStaffEntry;
    set LastInstructionStaffEntry(value: GraphicalStaffEntry);
    get ParentStaffLine(): StaffLine;
    set ParentStaffLine(value: StaffLine);
    /**
     * Reset all the geometric values and parameters of this measure and put it in an initialized state.
     * This is needed to evaluate a measure a second time by system builder.
     */
    resetLayout(): void;
    /**
     * Return the x-width of a given measure line.
     * @param line
     */
    getLineWidth(line: SystemLinesEnum): number;
    /**
     * Add the given clef to the begin of the measure.
     * This has to update/increase BeginInstructionsWidth.
     * @param clef
     */
    addClefAtBegin(clef: ClefInstruction): void;
    /**
     * Add the given key to the begin of the measure.
     * This has to update/increase BeginInstructionsWidth.
     * @param currentKey - The new valid key.
     * @param previousKey - The old cancelled key. Needed to show which accidentals are not valid any more.
     * @param currentClef - The valid clef. Needed to put the accidentals on the right y-positions.
     */
    addKeyAtBegin(currentKey: KeyInstruction, previousKey: KeyInstruction, currentClef: ClefInstruction): void;
    /**
     * Add the given rhythm to the begin of the measure.
     * This has to update/increase BeginInstructionsWidth.
     * @param rhythm
     */
    addRhythmAtBegin(rhythm: RhythmInstruction): void;
    /**
     * Add the given clef to the end of the measure.
     * This has to update/increase EndInstructionsWidth.
     * @param clef
     */
    addClefAtEnd(clef: ClefInstruction, visible?: boolean): void;
    /**
     * Set the x-position relative to the staffline (y-Position is always 0 relative to the staffline).
     * @param xPos
     */
    setPositionInStaffline(xPos: number): void;
    /**
     * Set the overall x-width of the measure.
     * @param width
     */
    setWidth(width: number): void;
    /**
     * This method is called after the StaffEntriesScaleFactor has been set.
     * Here the final x-positions of the staff entries have to be set.
     * (multiply the minimal positions with the scaling factor, considering the BeginInstructionsWidth).
     */
    layoutSymbols(): void;
    findGraphicalStaffEntryFromTimestamp(relativeTimestamp: Fraction): GraphicalStaffEntry;
    /**
     * Iterate from start to end and find the [[GraphicalStaffEntry]] with the same absolute timestamp.
     * @param absoluteTimestamp
     * @returns {any}
     */
    findGraphicalStaffEntryFromVerticalContainerTimestamp(absoluteTimestamp: Fraction): GraphicalStaffEntry;
    /**
     * Check if the all the [[GraphicalMeasure]]'s [[StaffEntry]]s (their minimum Length) have the same duration with the [[SourceMeasure]].
     * @returns {boolean}
     */
    hasSameDurationWithSourceMeasureParent(): boolean;
    /**
     * Check a whole [[Measure]] for the presence of multiple Voices (used for Stem direction).
     * @returns {boolean}
     */
    hasMultipleVoices(): boolean;
    isVisible(): boolean;
    getGraphicalMeasureDurationFromStaffEntries(): Fraction;
    addGraphicalStaffEntry(graphicalStaffEntry: GraphicalStaffEntry): void;
    /**
     * Add a [[StaffEntry]] (along with its [[BoundingBox]]) to the current Measure.
     * @param staffEntry
     */
    addGraphicalStaffEntryAtTimestamp(staffEntry: GraphicalStaffEntry): void;
    beginsWithLineRepetition(): boolean;
    /**
     * Check if this Measure is a Repetition Ending.
     * @returns {boolean}
     */
    endsWithLineRepetition(): boolean;
    /**
     * Check if a Repetition starts at the next Measure.
     * @returns {boolean}
     */
    beginsWithWordRepetition(): boolean;
    /**
     * Check if this Measure is a Repetition Ending.
     */
    endsWithWordRepetition(): boolean;
}
