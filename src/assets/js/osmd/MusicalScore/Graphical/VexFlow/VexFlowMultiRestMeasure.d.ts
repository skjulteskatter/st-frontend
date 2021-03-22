import Vex from "vexflow";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
import { Staff } from "../../VoiceData/Staff";
import { StaffLine } from "../StaffLine";
import { Beam } from "../../VoiceData/Beam";
import { GraphicalNote } from "../GraphicalNote";
import { GraphicalStaffEntry } from "../GraphicalStaffEntry";
import { Tuplet } from "../../VoiceData/Tuplet";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
import { Voice } from "../../VoiceData/Voice";
import { VexFlowMeasure } from "./VexFlowMeasure";
/** A GraphicalMeasure drawing a multiple-rest measure in Vexflow.
 *  Mostly copied from VexFlowMeasure.
 *  Even though most of those functions aren't needed, apparently you can't remove the layoutStaffEntry function.
 */
export declare class VexFlowMultiRestMeasure extends VexFlowMeasure {
    private multiRestElement;
    constructor(staff: Staff, sourceMeasure?: SourceMeasure, staffLine?: StaffLine);
    /**
     * Draw this measure on a VexFlow CanvasContext
     * @param ctx
     */
    draw(ctx: Vex.IRenderContext): void;
    format(): void;
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
    /**
     * Complete the creation of VexFlow Tuplets in this measure
     */
    finalizeTuplets(): void;
    layoutStaffEntry(graphicalStaffEntry: GraphicalStaffEntry): void;
    graphicalMeasureCreatedCalculations(): void;
    /**
     * Create the articulations for all notes of the current staff entry
     */
    protected createArticulations(): void;
    /**
     * Create the ornaments for all notes of the current staff entry
     */
    protected createOrnaments(): void;
    protected createFingerings(voiceEntry: GraphicalVoiceEntry): void;
    /**
     * Return the VexFlow Stave corresponding to this graphicalMeasure
     * @returns {Vex.Flow.Stave}
     */
    getVFStave(): Vex.Flow.Stave;
}
