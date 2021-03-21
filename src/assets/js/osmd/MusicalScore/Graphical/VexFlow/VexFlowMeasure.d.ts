import Vex from "vexflow";
import { GraphicalMeasure } from "../GraphicalMeasure";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
import { Staff } from "../../VoiceData/Staff";
import { StaffLine } from "../StaffLine";
import { SystemLinesEnum } from "../SystemLinesEnum";
import { ClefInstruction } from "../../VoiceData/Instructions/ClefInstruction";
import { KeyInstruction } from "../../VoiceData/Instructions/KeyInstruction";
import { RhythmInstruction } from "../../VoiceData/Instructions/RhythmInstruction";
import { Beam } from "../../VoiceData/Beam";
import { GraphicalNote } from "../GraphicalNote";
import { GraphicalStaffEntry } from "../GraphicalStaffEntry";
import { Tuplet } from "../../VoiceData/Tuplet";
import { RepetitionInstruction } from "../../VoiceData/Instructions/RepetitionInstruction";
import { SystemLinePosition } from "../SystemLinePosition";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
import { VexFlowVoiceEntry } from "./VexFlowVoiceEntry";
import { Voice } from "../../VoiceData/Voice";
import { EngravingRules } from "../EngravingRules";
export declare class VexFlowMeasure extends GraphicalMeasure {
    constructor(staff: Staff, sourceMeasure?: SourceMeasure, staffLine?: StaffLine);
    isTabMeasure: boolean;
    /** octaveOffset according to active clef */
    octaveOffset: number;
    /** The VexFlow Voices in the measure */
    vfVoices: {
        [voiceID: number]: Vex.Flow.Voice;
    };
    /** Call this function (if present) to x-format all the voices in the measure */
    formatVoices: (width: number, parent: VexFlowMeasure) => void;
    /** The VexFlow Ties in the measure */
    vfTies: Vex.Flow.StaveTie[];
    /** The repetition instructions given as words or symbols (coda, dal segno..) */
    vfRepetitionWords: Vex.Flow.Repetition[];
    /** The VexFlow Stave (= one measure in a staffline) */
    protected stave: Vex.Flow.Stave;
    /** VexFlow StaveConnectors (vertical lines) */
    protected connectors: Vex.Flow.StaveConnector[];
    /** Intermediate object to construct beams */
    private beams;
    /** Beams created by (optional) autoBeam function. */
    private autoVfBeams;
    /** Beams of tuplet notes created by (optional) autoBeam function. */
    private autoTupletVfBeams;
    /** VexFlow Beams */
    private vfbeams;
    /** Intermediate object to construct tuplets */
    protected tuplets: {
        [voiceID: number]: [Tuplet, VexFlowVoiceEntry[]][];
    };
    /** VexFlow Tuplets */
    private vftuplets;
    rules: EngravingRules;
    setAbsoluteCoordinates(x: number, y: number): void;
    /**
     * Reset all the geometric values and parameters of this measure and put it in an initialized state.
     * This is needed to evaluate a measure a second time by system builder.
     */
    resetLayout(): void;
    clean(): void;
    /**
     * returns the x-width (in units) of a given measure line {SystemLinesEnum}.
     * @param line
     * @returns the x-width in osmd units
     */
    getLineWidth(line: SystemLinesEnum): number;
    /**
     * adds the given clef to the begin of the measure.
     * This has to update/increase BeginInstructionsWidth.
     * @param clef
     */
    addClefAtBegin(clef: ClefInstruction): void;
    /**
     * Sets the number of stafflines that are rendered, so that they are centered properly
     * @param lineNumber
     */
    setLineNumber(lineNumber: number): void;
    /**
     * adds the given key to the begin of the measure.
     * This has to update/increase BeginInstructionsWidth.
     * @param currentKey the new valid key.
     * @param previousKey the old cancelled key. Needed to show which accidentals are not valid any more.
     * @param currentClef the valid clef. Needed to put the accidentals on the right y-positions.
     */
    addKeyAtBegin(currentKey: KeyInstruction, previousKey: KeyInstruction, currentClef: ClefInstruction): void;
    /**
     * adds the given rhythm to the begin of the measure.
     * This has to update/increase BeginInstructionsWidth.
     * @param rhythm
     */
    addRhythmAtBegin(rhythm: RhythmInstruction): void;
    /**
     * adds the given clef to the end of the measure.
     * This has to update/increase EndInstructionsWidth.
     * @param clef
     */
    addClefAtEnd(clef: ClefInstruction, visible?: boolean): void;
    addMeasureLine(lineType: SystemLinesEnum, linePosition: SystemLinePosition, renderInitialLine?: boolean): void;
    /**
     * Adds a measure number to the top left corner of the measure
     * This method is not used currently in favor of the calculateMeasureNumberPlacement
     * method in the MusicSheetCalculator.ts
     */
    addMeasureNumber(): void;
    addWordRepetition(repetitionInstruction: RepetitionInstruction): void;
    protected addVolta(repetitionInstruction: RepetitionInstruction): void;
    /**
     * Sets the overall x-width of the measure.
     * @param width
     */
    setWidth(width: number): void;
    /**
     * This method is called after the StaffEntriesScaleFactor has been set.
     * Here the final x-positions of the staff entries have to be set.
     * (multiply the minimal positions with the scaling factor, considering the BeginInstructionsWidth)
     */
    layoutSymbols(): void;
    /**
     * Draw this measure on a VexFlow CanvasContext
     * @param ctx
     */
    draw(ctx: Vex.IRenderContext): void;
    format(): void;
    correctNotePositions(): void;
    /**
     * Returns all the voices that are present in this measure
     */
    getVoicesWithinMeasure(): Voice[];
    /**
     * Returns all the graphicalVoiceEntries of a given Voice.
     * @param voice the voice for which the graphicalVoiceEntries shall be returned.
     */
    getGraphicalVoiceEntriesPerVoice(voice: Voice): GraphicalVoiceEntry[];
    /**
     * Finds the gaps between the existing notes within a measure.
     * Problem here is, that the graphicalVoiceEntry does not exist yet and
     * that Tied notes are not present in the normal voiceEntries.
     * To handle this, calculation with absolute timestamps is needed.
     * And the graphical notes have to be analysed directly (and not the voiceEntries, as it actually should be -> needs refactoring)
     * @param voice the voice for which the ghost notes shall be searched.
     */
    protected getRestFilledVexFlowStaveNotesPerVoice(voice: Voice): GraphicalVoiceEntry[];
    /**
     * Add a note to a beam
     * @param graphicalNote
     * @param beam
     */
    handleBeam(graphicalNote: GraphicalNote, beam: Beam): void;
    handleTuplet(graphicalNote: GraphicalNote, tuplet: Tuplet): void;
    /**
     * Complete the creation of VexFlow Beams in this measure
     */
    finalizeBeams(): void;
    /** Automatically creates beams for notes except beamedNotes, using Vexflow's Beam.generateBeams().
     *  Takes options from this.rules.AutoBeamOptions.
     * @param beamedNotes notes that will not be autobeamed (usually because they are already beamed)
     */
    private autoBeamNotes;
    /**
     * Complete the creation of VexFlow Tuplets in this measure
     */
    finalizeTuplets(): void;
    layoutStaffEntry(graphicalStaffEntry: GraphicalStaffEntry): void;
    graphicalMeasureCreatedCalculations(): void;
    private createArpeggio;
    /**
     * Copy the stem directions chosen by VexFlow to the StemDirection variable of the graphical notes
     */
    private setStemDirectionFromVexFlow;
    /**
     * Create the articulations for all notes of the current staff entry
     */
    protected createArticulations(): void;
    /**
     * Create the ornaments for all notes of the current staff entry
     */
    protected createOrnaments(): void;
    protected createFingerings(voiceEntry: GraphicalVoiceEntry): void;
    protected createStringNumber(voiceEntry: GraphicalVoiceEntry): void;
    /**
     * Creates a line from 'top' to this measure, of type 'lineType'
     * @param top
     * @param lineType
     */
    lineTo(top: VexFlowMeasure, lineType: any): void;
    /**
     * Return the VexFlow Stave corresponding to this graphicalMeasure
     * @returns {Vex.Flow.Stave}
     */
    getVFStave(): Vex.Flow.Stave;
    /**
     * After re-running the formatting on the VexFlow Stave, update the
     * space needed by Instructions (in VexFlow: StaveModifiers)
     */
    protected updateInstructionWidth(): void;
}
export declare enum StavePositionEnum {
    LEFT = 1,
    RIGHT = 2,
    ABOVE = 3,
    BELOW = 4,
    BEGIN = 5,
    END = 6
}
