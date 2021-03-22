import { IGraphicalSymbolFactory } from "../../Interfaces/IGraphicalSymbolFactory";
import { MusicSystem } from "../MusicSystem";
import { Staff } from "../../VoiceData/Staff";
import { StaffLine } from "../StaffLine";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
import { GraphicalMeasure } from "../GraphicalMeasure";
import { SourceStaffEntry } from "../../VoiceData/SourceStaffEntry";
import { GraphicalStaffEntry } from "../GraphicalStaffEntry";
import { Note } from "../../VoiceData/Note";
import { ClefInstruction } from "../../VoiceData/Instructions/ClefInstruction";
import { OctaveEnum } from "../../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { GraphicalNote } from "../GraphicalNote";
import { Pitch } from "../../../Common/DataObjects/Pitch";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { EngravingRules } from "../EngravingRules";
import { TechnicalInstruction } from "../../VoiceData/Instructions/TechnicalInstruction";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
import { VoiceEntry } from "../../VoiceData/VoiceEntry";
import { KeyInstruction } from "../../VoiceData/Instructions/KeyInstruction";
export declare class VexFlowGraphicalSymbolFactory implements IGraphicalSymbolFactory {
    /**
     * Create a new music system for the given page.
     * Currently only one vertically endless page exists where all systems are put to.
     * @param page
     * @param systemIndex
     * @returns {VexFlowMusicSystem}
     */
    createMusicSystem(systemIndex: number, rules: EngravingRules): MusicSystem;
    /**
     * Create a staffline object containing all staff measures belonging to a given system and staff.
     * @param parentSystem
     * @param parentStaff
     * @returns {VexFlowStaffLine}
     */
    createStaffLine(parentSystem: MusicSystem, parentStaff: Staff): StaffLine;
    /**
     * Construct an empty graphicalMeasure from the given source measure and staff.
     * @param sourceMeasure
     * @param staff
     * @returns {VexFlowMeasure}
     */
    createGraphicalMeasure(sourceMeasure: SourceMeasure, staff: Staff, isTabMeasure?: boolean): GraphicalMeasure;
    /**
     * Construct a MultiRestMeasure from the given source measure and staff.
     * @param sourceMeasure
     * @param staff
     * @returns {VexFlowMultiRestMeasure}
     */
    createMultiRestMeasure(sourceMeasure: SourceMeasure, staff: Staff, staffLine?: StaffLine): GraphicalMeasure;
    /**
     * Construct an empty Tab staffMeasure from the given source measure and staff.
     * @param sourceMeasure
     * @param staff
     * @returns {VexFlowTabMeasure}
     */
    createTabStaffMeasure(sourceMeasure: SourceMeasure, staff: Staff): GraphicalMeasure;
    /**
     * Create empty measure, which will be used to show key, rhythm changes at the end of the system.
     * @param staffLine
     * @returns {VexFlowMeasure}
     */
    createExtraGraphicalMeasure(staffLine: StaffLine): GraphicalMeasure;
    /**
     * Create a staffEntry in the given measure for a given sourceStaffEntry.
     * @param sourceStaffEntry
     * @param measure
     * @returns {VexFlowStaffEntry}
     */
    createStaffEntry(sourceStaffEntry: SourceStaffEntry, measure: GraphicalMeasure): GraphicalStaffEntry;
    createVoiceEntry(parentVoiceEntry: VoiceEntry, parentStaffEntry: GraphicalStaffEntry): GraphicalVoiceEntry;
    /**
     * Create a Graphical Note for given note and clef and as part of graphicalStaffEntry.
     * @param note
     * @param numberOfDots  The number of dots the note has to increase its musical duration.
     * @param graphicalStaffEntry
     * @param activeClef    The currently active clef, needed for positioning the note vertically
     * @param octaveShift   The currently active octave transposition enum, needed for positioning the note vertically
     * @returns {GraphicalNote}
     */
    createNote(note: Note, graphicalVoiceEntry: GraphicalVoiceEntry, activeClef: ClefInstruction, octaveShift: OctaveEnum, rules: EngravingRules, graphicalNoteLength?: Fraction): GraphicalNote;
    /**
     * Create a Graphical Grace Note (smaller head, stem...) for given note and clef and as part of graphicalStaffEntry.
     * @param note
     * @param numberOfDots
     * @param graphicalVoiceEntry
     * @param activeClef
     * @param octaveShift
     * @returns {GraphicalNote}
     */
    createGraceNote(note: Note, graphicalVoiceEntry: GraphicalVoiceEntry, activeClef: ClefInstruction, rules: EngravingRules, octaveShift?: OctaveEnum): GraphicalNote;
    /**
     * Sets a pitch which will be used for rendering the given graphical note (not changing the original pitch of the note!!!).
     * Will be only called if the displayed accidental is different from the original (e.g. a C# with C# as key instruction)
     * @param graphicalNote
     * @param pitch The pitch which will be rendered.
     */
    addGraphicalAccidental(graphicalNote: GraphicalNote, pitch: Pitch): void;
    /**
     * Adds a Fermata symbol at the last note of the given tied Note.
     * The last graphical note of this tied note is located at the given graphicalStaffEntry.
     * A Fermata has to be located at the last tied note.
     * @param tiedNote
     * @param graphicalStaffEntry
     */
    addFermataAtTiedEndNote(tiedNote: Note, graphicalStaffEntry: GraphicalStaffEntry): void;
    /**
     * Adds a clef change within a measure before the given staff entry.
     * @param graphicalStaffEntry
     * @param clefInstruction
     */
    createInStaffClef(graphicalStaffEntry: GraphicalStaffEntry, clefInstruction: ClefInstruction): void;
    /**
     * Adds a chord symbol at the given staff entry
     * @param sourceStaffEntry
     * @param graphicalStaffEntry
     * @param transposeHalftones
     */
    createChordSymbols(sourceStaffEntry: SourceStaffEntry, graphicalStaffEntry: GraphicalStaffEntry, keyInstruction: KeyInstruction, transposeHalftones: number): void;
    /**
     * Adds a technical instruction at the given staff entry.
     * @param technicalInstruction
     * @param graphicalStaffEntry
     */
    createGraphicalTechnicalInstruction(technicalInstruction: TechnicalInstruction, graphicalStaffEntry: GraphicalStaffEntry): void;
}
