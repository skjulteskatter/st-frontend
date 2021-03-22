import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
import { StaffLine } from "./StaffLine";
import { GraphicalMusicSheet } from "./GraphicalMusicSheet";
import { EngravingRules } from "./EngravingRules";
import { Tie } from "../VoiceData/Tie";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { Note } from "../VoiceData/Note";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { ClefInstruction } from "../VoiceData/Instructions/ClefInstruction";
import { LyricWord } from "../VoiceData/Lyrics/LyricsWord";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
import { GraphicalMusicPage } from "./GraphicalMusicPage";
import { GraphicalNote } from "./GraphicalNote";
import { Beam } from "../VoiceData/Beam";
import { OctaveEnum } from "../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { VoiceEntry } from "../VoiceData/VoiceEntry";
import { OrnamentContainer } from "../VoiceData/OrnamentContainer";
import { Articulation } from "../VoiceData/Articulation";
import { Tuplet } from "../VoiceData/Tuplet";
import { MusicSystem } from "./MusicSystem";
import { GraphicalTie } from "./GraphicalTie";
import { RepetitionInstruction } from "../VoiceData/Instructions/RepetitionInstruction";
import { MultiExpression } from "../VoiceData/Expressions/MultiExpression";
import { StaffEntryLink } from "../VoiceData/StaffEntryLink";
import { MultiTempoExpression } from "../VoiceData/Expressions/MultiTempoExpression";
import { Repetition } from "../MusicSource/Repetition";
import { PointF2D } from "../../Common/DataObjects/PointF2D";
import { SourceStaffEntry } from "../VoiceData/SourceStaffEntry";
import { BoundingBox } from "./BoundingBox";
import { GraphicalLabel } from "./GraphicalLabel";
import { TextAlignmentEnum } from "../../Common/Enums/TextAlignment";
import { TechnicalInstruction } from "../VoiceData/Instructions/TechnicalInstruction";
import { IGraphicalSymbolFactory } from "../Interfaces/IGraphicalSymbolFactory";
import { ITextMeasurer } from "../Interfaces/ITextMeasurer";
import { ITransposeCalculator } from "../Interfaces/ITransposeCalculator";
import { AccidentalCalculator } from "./AccidentalCalculator";
import { GraphicalLyricWord } from "./GraphicalLyricWord";
import { PlacementEnum } from "../VoiceData/Expressions/AbstractExpression";
import { InstantaneousTempoExpression } from "../VoiceData/Expressions/InstantaneousTempoExpression";
import { FontStyles } from "../../Common/Enums/FontStyles";
import { GraphicalInstantaneousDynamicExpression } from "./GraphicalInstantaneousDynamicExpression";
import { GraphicalContinuousDynamicExpression } from "./GraphicalContinuousDynamicExpression";
import { IStafflineNoteCalculator } from "../Interfaces/IStafflineNoteCalculator";
/**
 * Class used to do all the calculations in a MusicSheet, which in the end populates a GraphicalMusicSheet.
 */
export declare abstract class MusicSheetCalculator {
    static symbolFactory: IGraphicalSymbolFactory;
    static transposeCalculator: ITransposeCalculator;
    static stafflineNoteCalculator: IStafflineNoteCalculator;
    protected static textMeasurer: ITextMeasurer;
    protected staffEntriesWithGraphicalTies: GraphicalStaffEntry[];
    protected staffEntriesWithOrnaments: GraphicalStaffEntry[];
    protected staffEntriesWithChordSymbols: GraphicalStaffEntry[];
    protected staffLinesWithLyricWords: StaffLine[];
    protected graphicalLyricWords: GraphicalLyricWord[];
    protected graphicalMusicSheet: GraphicalMusicSheet;
    protected rules: EngravingRules;
    protected musicSystems: MusicSystem[];
    private abstractNotImplementedErrorMessage;
    static get TextMeasurer(): ITextMeasurer;
    static set TextMeasurer(value: ITextMeasurer);
    protected get leadSheet(): boolean;
    protected static setMeasuresMinStaffEntriesWidth(measures: GraphicalMeasure[], minimumStaffEntriesWidth: number): void;
    initialize(graphicalMusicSheet: GraphicalMusicSheet): void;
    /**
     * Build the 2D [[GraphicalMeasure]] list needed for the [[MusicSheetCalculator]].
     * Internally it creates [[GraphicalMeasure]]s, [[GraphicalStaffEntry]]'s and [[GraphicalNote]]s.
     */
    prepareGraphicalMusicSheet(): void;
    /**
     * The main method for the Calculator.
     */
    calculate(): void;
    calculateXLayout(graphicalMusicSheet: GraphicalMusicSheet, maxInstrNameLabelLength: number): void;
    calculateMeasureWidthFromStaffEntries(measuresVertical: GraphicalMeasure[], oldMinimumStaffEntriesWidth: number): number;
    protected formatMeasures(): void;
    /**
     * Calculates the x layout of the staff entries within the staff measures belonging to one source measure.
     * All staff entries are x-aligned throughout all the measures.
     * @param measures - The minimum required x width of the source measure
     */
    protected calculateMeasureXLayout(measures: GraphicalMeasure[]): number;
    /**
     * Called for every source measure when generating the list of staff measures for it.
     */
    protected initGraphicalMeasuresCreation(): void;
    protected handleBeam(graphicalNote: GraphicalNote, beam: Beam, openBeams: Beam[]): void;
    /**
     * Check if the tied graphical note belongs to any beams or tuplets and react accordingly.
     * @param tiedGraphicalNote
     * @param beams
     * @param activeClef
     * @param octaveShiftValue
     * @param graphicalStaffEntry
     * @param duration
     * @param openTie
     * @param isLastTieNote
     */
    protected handleTiedGraphicalNote(tiedGraphicalNote: GraphicalNote, beams: Beam[], activeClef: ClefInstruction, octaveShiftValue: OctaveEnum, graphicalStaffEntry: GraphicalStaffEntry, duration: Fraction, openTie: Tie, isLastTieNote: boolean): void;
    protected handleVoiceEntryLyrics(voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry, openLyricWords: LyricWord[]): void;
    protected handleVoiceEntryOrnaments(ornamentContainer: OrnamentContainer, voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry): void;
    protected handleVoiceEntryArticulations(articulations: Articulation[], voiceEntry: VoiceEntry, staffEntry: GraphicalStaffEntry): void;
    /**
     * Adds a technical instruction at the given staff entry.
     * @param technicalInstructions
     * @param voiceEntry
     * @param staffEntry
     */
    protected handleVoiceEntryTechnicalInstructions(technicalInstructions: TechnicalInstruction[], voiceEntry: VoiceEntry, staffEntry: GraphicalStaffEntry): void;
    protected handleTuplet(graphicalNote: GraphicalNote, tuplet: Tuplet, openTuplets: Tuplet[]): void;
    protected layoutVoiceEntry(voiceEntry: VoiceEntry, graphicalNotes: GraphicalNote[], graphicalStaffEntry: GraphicalStaffEntry, hasPitchedNote: boolean): void;
    protected layoutStaffEntry(graphicalStaffEntry: GraphicalStaffEntry): void;
    protected createGraphicalTie(tie: Tie, startGse: GraphicalStaffEntry, endGse: GraphicalStaffEntry, startNote: GraphicalNote, endNote: GraphicalNote): GraphicalTie;
    protected updateStaffLineBorders(staffLine: StaffLine): void;
    /**
     * Iterate through all Measures and calculates the MeasureNumberLabels.
     * @param musicSystem
     */
    protected calculateMeasureNumberPlacement(musicSystem: MusicSystem): void;
    private calculateSingleMeasureNumberPlacement;
    /**
     * Calculate the shape (Bézier curve) for this tie.
     * @param tie
     * @param tieIsAtSystemBreak
     */
    protected layoutGraphicalTie(tie: GraphicalTie, tieIsAtSystemBreak: boolean, isTab: boolean): void;
    /**
     * Calculate the Lyrics YPositions for a single [[StaffLine]].
     * @param staffLine
     * @param lyricVersesNumber
     */
    protected calculateSingleStaffLineLyricsPosition(staffLine: StaffLine, lyricVersesNumber: number[]): GraphicalStaffEntry[];
    /**
     * calculates the dashes of lyric words and the extending underscore lines of syllables sung on more than one note.
     * @param lyricsStaffEntries
     */
    protected calculateLyricsExtendsAndDashes(lyricsStaffEntries: GraphicalStaffEntry[]): void;
    /**
     * Calculate a single OctaveShift for a [[MultiExpression]].
     * @param sourceMeasure
     * @param multiExpression
     * @param measureIndex
     * @param staffIndex
     */
    protected calculateSingleOctaveShift(sourceMeasure: SourceMeasure, multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /**
     * Calculate all the textual [[RepetitionInstruction]]s (e.g. dal segno) for a single [[SourceMeasure]].
     * @param repetitionInstruction
     * @param measureIndex
     */
    protected calculateWordRepetitionInstruction(repetitionInstruction: RepetitionInstruction, measureIndex: number): void;
    /**
     * Calculate all the Mood and Unknown Expressions for a single [[MultiExpression]].
     * @param multiExpression
     * @param measureIndex
     * @param staffIndex
     */
    protected calculateMoodAndUnknownExpression(multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /**
     * Delete all Objects that must be recalculated.
     * If graphicalMusicSheet.reCalculate has been called, then this method will be called to reset or remove all flexible
     * graphical music symbols (e.g. Ornaments, Lyrics, Slurs) graphicalMusicSheet will have MusicPages, they will have MusicSystems etc...
     */
    protected clearRecreatedObjects(): void;
    /**
     * This method handles a [[StaffEntryLink]].
     * @param graphicalStaffEntry
     * @param staffEntryLinks
     */
    protected handleStaffEntryLink(graphicalStaffEntry: GraphicalStaffEntry, staffEntryLinks: StaffEntryLink[]): void;
    /**
     * Store the newly computed [[Measure]]s in newly created [[MusicSystem]]s.
     */
    protected calculateMusicSystems(): void;
    protected calculateMarkedAreas(): void;
    protected calculateChordSymbols(): void;
    /**
     * Do layout on staff measures which only consist of a full rest.
     * @param rest
     * @param gse
     * @param measure
     */
    protected layoutMeasureWithWholeRest(rest: GraphicalNote, gse: GraphicalStaffEntry, measure: GraphicalMeasure): void;
    protected layoutBeams(staffEntry: GraphicalStaffEntry): void;
    protected layoutArticulationMarks(articulations: Articulation[], voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry): void;
    protected layoutOrnament(ornaments: OrnamentContainer, voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry): void;
    protected calculateRestNotePlacementWithinGraphicalBeam(graphicalStaffEntry: GraphicalStaffEntry, restNote: GraphicalNote, previousNote: GraphicalNote, nextStaffEntry: GraphicalStaffEntry, nextNote: GraphicalNote): void;
    protected calculateTupletNumbers(): void;
    protected calculateSlurs(): void;
    protected calculateDynamicExpressionsForMultiExpression(multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /**
     * This method calculates the RelativePosition of a single verbal GraphicalContinuousDynamic.
     * @param graphicalContinuousDynamic Graphical continous dynamic to be calculated
     * @param startPosInStaffline Starting point in staff line
     */
    protected calculateGraphicalVerbalContinuousDynamic(graphicalContinuousDynamic: GraphicalContinuousDynamicExpression, startPosInStaffline: PointF2D): void;
    /**
     * This method calculates the RelativePosition of a single GraphicalContinuousDynamic.
     * @param graphicalContinuousDynamic Graphical continous dynamic to be calculated
     * @param startPosInStaffline Starting point in staff line
     */
    calculateGraphicalContinuousDynamic(graphicalContinuousDynamic: GraphicalContinuousDynamicExpression, startPosInStaffline: PointF2D): void;
    /**
     * This method calculates the RelativePosition of a single GraphicalInstantaneousDynamicExpression.
     * @param graphicalInstantaneousDynamic Dynamic expression to be calculated
     * @param startPosInStaffline Starting point in staff line
     */
    protected calculateGraphicalInstantaneousDynamicExpression(graphicalInstantaneousDynamic: GraphicalInstantaneousDynamicExpression, startPosInStaffline: PointF2D): void;
    protected calcGraphicalRepetitionEndingsRecursively(repetition: Repetition): void;
    /**
     * Calculate a single GraphicalRepetition.
     * @param start
     * @param end
     * @param numberText
     * @param offset
     * @param leftOpen
     * @param rightOpen
     */
    protected layoutSingleRepetitionEnding(start: GraphicalMeasure, end: GraphicalMeasure, numberText: string, offset: number, leftOpen: boolean, rightOpen: boolean): void;
    protected calculateLabel(staffLine: StaffLine, relative: PointF2D, combinedString: string, style: FontStyles, placement: PlacementEnum, fontHeight: number, textAlignment?: TextAlignmentEnum): GraphicalLabel;
    protected calculateTempoExpressionsForMultiTempoExpression(sourceMeasure: SourceMeasure, multiTempoExpression: MultiTempoExpression, measureIndex: number): void;
    protected createMetronomeMark(metronomeExpression: InstantaneousTempoExpression): void;
    protected graphicalMeasureCreatedCalculations(measure: GraphicalMeasure): void;
    protected clearSystemsAndMeasures(): void;
    protected handleVoiceEntry(voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry, accidentalCalculator: AccidentalCalculator, openLyricWords: LyricWord[], activeClef: ClefInstruction, openTuplets: Tuplet[], openBeams: Beam[], octaveShiftValue: OctaveEnum, staffIndex: number, linkedNotes?: Note[], sourceStaffEntry?: SourceStaffEntry): OctaveEnum;
    protected resetYPositionForLeadSheet(psi: BoundingBox): void;
    protected layoutVoiceEntries(graphicalStaffEntry: GraphicalStaffEntry, staffIndex: number): void;
    protected maxInstrNameLabelLength(): number;
    protected calculateSheetLabelBoundingBoxes(): void;
    protected checkMeasuresForWholeRestNotes(): void;
    protected optimizeRestNotePlacement(graphicalStaffEntry: GraphicalStaffEntry, measure: GraphicalMeasure): void;
    protected getRelativePositionInStaffLineFromTimestamp(timestamp: Fraction, verticalIndex: number, staffLine: StaffLine, multiStaffInstrument: boolean, firstVisibleMeasureRelativeX?: number): PointF2D;
    protected getRelativeXPositionFromTimestamp(timestamp: Fraction): number;
    protected calculatePageLabels(page: GraphicalMusicPage): void;
    protected createGraphicalTies(): void;
    private handleTie;
    private createAccidentalCalculators;
    private calculateVerticalContainersList;
    private setIndicesToVerticalGraphicalContainers;
    private createGraphicalMeasuresForSourceMeasure;
    private createGraphicalMeasure;
    private checkNoteForAccidental;
    private handleStaffEntries;
    private calculateSkyBottomLines;
    /**
     * Re-adjust the x positioning of expressions.
     */
    protected calculateExpressionAlignements(): void;
    private calculateStaffEntryArticulationMarks;
    private calculateOrnaments;
    private optimizeRestPlacement;
    private calculateTwoRestNotesPlacementWithCollisionDetection;
    private calculateRestNotePlacementWithCollisionDetectionFromGraphicalNote;
    private calculateTieCurves;
    private calculateLyricsPosition;
    /**
     * This method calculates the dashes within the syllables of a LyricWord
     * @param lyricEntry
     */
    private calculateSingleLyricWord;
    /**
     * This method calculates Dashes for a LyricWord.
     * @param staffLine
     * @param startX
     * @param endX
     * @param y
     */
    private calculateDashes;
    /**
     * This method calculates a single Dash for a LyricWord, positioned in the middle of the given distance.
     * @param {StaffLine} staffLine
     * @param {number} startX
     * @param {number} endX
     * @param {number} y
     */
    private calculateSingleDashForLyricWord;
    /**
     * Layouts the underscore line when a lyric entry is marked as extend
     * @param {GraphicalLyricEntry} lyricEntry
     */
    private calculateLyricExtend;
    /**
     * This method calculates a single underscoreLine.
     * @param staffLine
     * @param startX
     * @param end
     * @param y
     */
    private calculateSingleLyricWordWithUnderscore;
    /**
     * This method calculates two Dashes for a LyricWord, positioned at the the two ends of the given distance.
     * @param {StaffLine} staffLine
     * @param {number} startX
     * @param {number} endX
     * @param {number} y
     * @returns {number}
     */
    private calculateRightAndLeftDashesForLyricWord;
    private calculateDynamicExpressions;
    private calculateOctaveShifts;
    private getFirstLeftNotNullStaffEntryFromContainer;
    private getFirstRightNotNullStaffEntryFromContainer;
    private calculateWordRepetitionInstructions;
    private calculateRepetitionEndings;
    private calculateTempoExpressions;
    private calculateRehearsalMarks;
    protected calculateRehearsalMark(measure: SourceMeasure): void;
    private calculateMoodAndUnknownExpressions;
    /**
     * Calculates the desired stem direction depending on the number (or type) of voices.
     * If more than one voice is there, the main voice (typically the first or upper voice) will get stem up direction.
     * The others get stem down direction.
     * @param voiceEntry the voiceEntry for which the stem direction has to be calculated
     */
    private calculateStemDirectionFromVoices;
    /** Sets a voiceEntry's stem direction to one already set in other notes in its beam, if it has one. */
    private setBeamNotesWantedStemDirections;
}
