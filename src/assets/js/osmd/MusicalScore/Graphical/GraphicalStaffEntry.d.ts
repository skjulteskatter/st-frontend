import { SourceStaffEntry } from "../VoiceData/SourceStaffEntry";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { VerticalGraphicalStaffEntryContainer } from "./VerticalGraphicalStaffEntryContainer";
import { Note } from "../VoiceData/Note";
import { Slur } from "../VoiceData/Expressions/ContinuousExpressions/Slur";
import { Voice } from "../VoiceData/Voice";
import { VoiceEntry } from "../VoiceData/VoiceEntry";
import { GraphicalTie } from "./GraphicalTie";
import { GraphicalObject } from "./GraphicalObject";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { GraphicalNote } from "./GraphicalNote";
import { GraphicalChordSymbolContainer } from "./GraphicalChordSymbolContainer";
import { GraphicalLyricEntry } from "./GraphicalLyricEntry";
import { AbstractGraphicalInstruction } from "./AbstractGraphicalInstruction";
import { GraphicalStaffEntryLink } from "./GraphicalStaffEntryLink";
import { GraphicalVoiceEntry } from "./GraphicalVoiceEntry";
/**
 * The graphical counterpart of a [[SourceStaffEntry]].
 */
export declare abstract class GraphicalStaffEntry extends GraphicalObject {
    constructor(parentMeasure: GraphicalMeasure, sourceStaffEntry?: SourceStaffEntry, staffEntryParent?: GraphicalStaffEntry);
    graphicalChordContainers: GraphicalChordSymbolContainer[];
    graphicalLink: GraphicalStaffEntryLink;
    relInMeasureTimestamp: Fraction;
    sourceStaffEntry: SourceStaffEntry;
    parentMeasure: GraphicalMeasure;
    graphicalVoiceEntries: GraphicalVoiceEntry[];
    staffEntryParent: GraphicalStaffEntry;
    parentVerticalContainer: VerticalGraphicalStaffEntryContainer;
    tabStaffEntry: GraphicalStaffEntry;
    MaxAccidentals: number;
    private graphicalInstructions;
    private graphicalTies;
    private lyricsEntries;
    get GraphicalInstructions(): AbstractGraphicalInstruction[];
    get GraphicalTies(): GraphicalTie[];
    get LyricsEntries(): GraphicalLyricEntry[];
    set LyricsEntries(value: GraphicalLyricEntry[]);
    /**
     * Calculate the absolute Timestamp.
     * @returns {Fraction}
     */
    getAbsoluteTimestamp(): Fraction;
    /**
     * Search through all the GraphicalNotes to find the suitable one for a TieEndNote.
     * @param tieNote
     * @returns {any}
     */
    findTieGraphicalNoteFromNote(tieNote: Note): GraphicalNote;
    /**
     * Search through all [[GraphicalNote]]s to find the suitable one for an StartSlurNote (that 's also an EndTieNote).
     * @param tieNote
     * @param slur
     * @returns {any}
     */
    findEndTieGraphicalNoteFromNoteWithStartingSlur(tieNote: Note, slur: Slur): GraphicalNote;
    findGraphicalNoteFromGraceNote(graceNote: Note): GraphicalNote;
    findGraphicalNoteFromNote(note: Note): GraphicalNote;
    getGraphicalNoteDurationFromVoice(voice: Voice): Fraction;
    /**
     * Find the [[StaffEntry]]'s [[GraphicalNote]]s that correspond to the given [[VoiceEntry]]'s [[Note]]s.
     * @param voiceEntry
     * @returns {any}
     */
    findVoiceEntryGraphicalNotes(voiceEntry: VoiceEntry): GraphicalNote[];
    /**
     * Check if the given [[VoiceEntry]] is part of the [[StaffEntry]]'s Linked [[VoiceEntry]].
     * @param voiceEntry
     * @returns {boolean}
     */
    isVoiceEntryPartOfLinkedVoiceEntry(voiceEntry: VoiceEntry): boolean;
    /**
     * Return the [[StaffEntry]]'s Minimum NoteLength.
     * @returns {Fraction}
     */
    findStaffEntryMinNoteLength(): Fraction;
    findStaffEntryMaxNoteLength(): Fraction;
    /**
     * Find or creates the list of [[GraphicalNote]]s in case of a [[VoiceEntry]] (not from TiedNote).
     * @param voiceEntry
     * @returns {GraphicalNote[]}
     */
    findOrCreateGraphicalVoiceEntry(voiceEntry: VoiceEntry): GraphicalVoiceEntry;
    /**
     * Find or creates the list of [[GraphicalNote]]s in case of a TiedNote.
     * @param graphicalNote
     * @returns {GraphicalNote[]}
     */
    findOrCreateGraphicalVoiceEntryFromGraphicalNote(graphicalNote: GraphicalNote): GraphicalVoiceEntry;
    /**
     * Insert the [[GraphicalNote]] to the correct index of the [[GraphicalNote]]s list,
     * so that the order of the [[GraphicalNote]]'s in the list corresponds to the [[VoiceEntry]]'s [[Note]]s order.
     * (needed when adding Tie-EndNotes).
     * @param graphicalNotes
     * @param graphicalNote
     */
    addGraphicalNoteToListAtCorrectYPosition(gve: GraphicalVoiceEntry, graphicalNote: GraphicalNote): void;
    /**
     * Returns true if this staff entry has only rests
     */
    hasOnlyRests(): boolean;
}
