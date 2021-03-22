import { GraphicalMeasure } from "./GraphicalMeasure";
import { GraphicalMusicPage } from "./GraphicalMusicPage";
import { EngravingRules } from "./EngravingRules";
import { RhythmInstruction } from "../VoiceData/Instructions/RhythmInstruction";
import { KeyInstruction } from "../VoiceData/Instructions/KeyInstruction";
import { ClefInstruction } from "../VoiceData/Instructions/ClefInstruction";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
import { MusicSystem } from "./MusicSystem";
import { Staff } from "../VoiceData/Staff";
import { SourceStaffEntry } from "../VoiceData/SourceStaffEntry";
import { SystemLinesEnum } from "./SystemLinesEnum";
import { GraphicalMusicSheet } from "./GraphicalMusicSheet";
export declare class MusicSystemBuilder {
    protected measureList: GraphicalMeasure[][];
    protected graphicalMusicSheet: GraphicalMusicSheet;
    protected currentSystemParams: SystemBuildParameters;
    protected numberOfVisibleStaffLines: number;
    protected rules: EngravingRules;
    protected measureListIndex: number;
    protected musicSystems: MusicSystem[];
    /**
     * Does the mapping from the currently visible staves to the global staff-list of the music sheet.
     */
    protected visibleStaffIndices: number[];
    protected activeRhythm: RhythmInstruction[];
    protected activeKeys: KeyInstruction[];
    protected activeClefs: ClefInstruction[];
    protected globalSystemIndex: number;
    protected leadSheet: boolean;
    initialize(graphicalMusicSheet: GraphicalMusicSheet, measureList: GraphicalMeasure[][], numberOfStaffLines: number): void;
    buildMusicSystems(): MusicSystem[];
    /**
     * calculates the y positions of the staff lines within a system and
     * furthermore the y positions of the systems themselves.
     */
    calculateSystemYLayout(): void;
    /**
     * Set the Width of the staff-Measures of one source measure.
     * @param graphicalMeasures
     * @param width
     * @param beginInstrWidth
     * @param endInstrWidth
     */
    protected setMeasureWidth(graphicalMeasures: GraphicalMeasure[], width: number, beginInstrWidth: number, endInstrWidth: number): void;
    /**
     * When the actual source measure doesn't fit any more, this method finalizes the current system and
     * opens up a new empty system, where the actual measure will be added in the next iteration.
     * @param measures
     * @param isPartEndingSystem
     */
    protected finalizeCurrentAndCreateNewSystem(measures: GraphicalMeasure[], systemEndsPart?: boolean, checkExtraInstructionMeasure?: boolean, startNewPage?: boolean): void;
    protected finalizeCurrentSystem(measures: GraphicalMeasure[], systemEndsPart?: boolean, checkExtraInstructionMeasure?: boolean, startNewPage?: boolean): void;
    /**
     * If a line repetition is ending and a new line repetition is starting at the end of the system,
     * the double repetition line has to be split into two: one at the currently ending system and
     * one at the next system.
     * (this should be refactored at some point to not use a combined end/start line but always separated lines)
     */
    protected adaptRepetitionLineWithIfNeeded(): void;
    protected addMeasureToSystem(graphicalMeasures: GraphicalMeasure[], measureStartLine: SystemLinesEnum, measureEndLine: SystemLinesEnum, totalMeasureWidth: number, currentMeasureBeginInstructionsWidth: number, currentVarWidth: number, currentMeasureEndInstructionsWidth: number): void;
    /**
     * Initialize a new [[MusicSystem]].
     * @returns {MusicSystem}
     */
    protected initMusicSystem(): MusicSystem;
    /**
     * Get the width the system should have for a given page width.
     * @returns {number}
     */
    protected getFullPageSystemWidth(): number;
    protected layoutSystemStaves(musicSystem: MusicSystem): void;
    /**
     * Calculate the [[StaffLine]](s) needed for a [[MusicSystem]].
     * @param musicSystem
     * @param relativeYPosition
     * @param staff
     */
    protected addStaffLineToMusicSystem(musicSystem: MusicSystem, relativeYPosition: number, staff: Staff): void;
    /**
     * Initialize the active Instructions from the first [[SourceMeasure]] of first [[SourceMusicPart]].
     * @param measureList
     */
    protected initializeActiveInstructions(measureList: GraphicalMeasure[]): void;
    protected transposeKeyInstruction(keyInstruction: KeyInstruction, graphicalMeasure: GraphicalMeasure): KeyInstruction;
    /**
     * Calculate the width needed for Instructions (Key, Clef, Rhythm, Repetition) for the measure.
     * @param measures
     * @param isSystemFirstMeasure
     * @param isFirstSourceMeasure
     * @returns {number}
     */
    protected addBeginInstructions(measures: GraphicalMeasure[], isSystemFirstMeasure: boolean, isFirstSourceMeasure: boolean): number;
    /**
     * Calculates the width needed for Instructions (Clef, Repetition) for the measure.
     * @param measures
     * @returns {number}
     */
    protected addEndInstructions(measures: GraphicalMeasure[]): number;
    protected AddInstructionsAtMeasureBegin(firstEntry: SourceStaffEntry, measure: GraphicalMeasure, visibleStaffIdx: number, isFirstSourceMeasure: boolean, isSystemStartMeasure: boolean): number;
    protected addInstructionsAtMeasureEnd(lastEntry: SourceStaffEntry, measure: GraphicalMeasure, measures: GraphicalMeasure[]): number;
    /**
     * Track down and update the active ClefInstruction in Measure's StaffEntries.
     * This has to be done after the measure is added to a system
     * (otherwise already the check if the measure fits to the system would update the active clefs..)
     * @param measure
     * @param graphicalMeasures
     */
    protected updateActiveClefs(measure: SourceMeasure, graphicalMeasures: GraphicalMeasure[]): void;
    /**
     * Check if an extra Instruction [[Measure]] is needed.
     * @param measures
     */
    protected checkAndCreateExtraInstructionMeasure(measures: GraphicalMeasure[]): void;
    protected addExtraInstructionMeasure(visStaffIdx: number, keyInstruction: KeyInstruction, rhythmInstruction: RhythmInstruction): number;
    /**
     * Add all current vertical Measures to currentSystem.
     * @param graphicalMeasures
     */
    protected addStaveMeasuresToSystem(graphicalMeasures: GraphicalMeasure[]): void;
    /**
     * Return the width of the corresponding [[SystemLine]] and set the corresponding [[SystemLineEnum]].
     * @returns {SystemLinesEnum}
     */
    protected getMeasureStartLine(): SystemLinesEnum;
    protected getMeasureEndLine(): SystemLinesEnum;
    /**
     * Return the width of the corresponding [[SystemLine]] and sets the corresponding [[SystemLineEnum]].
     * @param measure
     * @param systemLineEnum
     * @param isSystemStartMeasure
     * @returns {number}
     */
    protected getLineWidth(measure: GraphicalMeasure, systemLineEnum: SystemLinesEnum, isSystemStartMeasure: boolean): number;
    protected previousMeasureEndsLineRepetition(): boolean;
    /**
     * Check if at this [[Measure]] starts a [[Repetition]].
     * @returns {boolean}
     */
    protected thisMeasureBeginsLineRepetition(): boolean;
    /**
     * Check if a [[Repetition]] starts at the next [[Measure]].
     * @returns {boolean}
     */
    protected nextMeasureBeginsLineRepetition(): boolean;
    /**
     * Check if this [[Measure]] is a [[Repetition]] ending.
     * @returns {boolean}
     */
    protected thisMeasureEndsLineRepetition(): boolean;
    /**
     * Check if a [[Repetition]] starts at the next [[Measure]].
     * @returns {boolean}
     */
    protected nextMeasureBeginsWordRepetition(): boolean;
    /**
     * Check if this [[Measure]] is a [[Repetition]] ending.
     * @returns {boolean}
     */
    protected thisMeasureEndsWordRepetition(): boolean;
    /**
     * Check if the next [[Measure]] has a [[KeyInstruction]] change.
     * @returns {boolean}
     */
    protected nextMeasureHasKeyInstructionChange(): boolean;
    protected getNextMeasureKeyInstruction(): KeyInstruction;
    /**
     * Calculate the X ScalingFactor in order to strech the whole System.
     * @param systemFixWidth
     * @param systemVarWidth
     * @returns {number}
     */
    protected calculateXScalingFactor(systemFixWidth: number, systemVarWidth: number): number;
    /**
     * Stretch the whole System so that no white space is left at the end.
     * @param systemEndsPart
     */
    protected stretchMusicSystem(systemEndsPart: boolean): void;
    /**
     * If the last [[MusicSystem]] doesn't need stretching, then this method decreases the System's Width,
     * the [[StaffLine]]'s Width and the 5 [[StaffLine]]s length.
     */
    protected decreaseMusicSystemBorders(): void;
    /**
     * This method updates the System's StaffLine's RelativePosition (starting from the given index).
     * @param musicSystem
     * @param index
     * @param value
     */
    protected updateStaffLinesRelativePosition(musicSystem: MusicSystem, index: number, value: number): void;
    /**
     * Create a new [[GraphicalMusicPage]]
     * (for now only one long page is used per music sheet, as we scroll down and have no page flips)
     * @returns {GraphicalMusicPage}
     */
    protected createMusicPage(): GraphicalMusicPage;
    protected addSystemToPage(page: GraphicalMusicPage, system: MusicSystem): void;
    /**
     * This method checks the distances between any two consecutive StaffLines of a System and if needed, shifts the lower one down.
     * @param musicSystem
     */
    protected optimizeDistanceBetweenStaffLines(musicSystem: MusicSystem): void;
    /** Calculates the relative Positions of all MusicSystems.
     *
     */
    protected calculateMusicSystemsRelativePositions(): void;
    /**
     * Finds the minimum required distance between two systems
     * with the help of the sky- and bottom lines
     * @param upperSystem
     * @param lowerSystem
     */
    private findRequiredDistanceWithSkyBottomLine;
}
export declare class SystemBuildParameters {
    currentSystem: MusicSystem;
    systemMeasures: MeasureBuildParameters[];
    systemMeasureIndex: number;
    currentWidth: number;
    currentSystemFixWidth: number;
    currentSystemVarWidth: number;
    maxLabelLength: number;
    IsSystemStartMeasure(): boolean;
}
export declare class MeasureBuildParameters {
    beginLine: SystemLinesEnum;
    endLine: SystemLinesEnum;
}
