import { VoiceEntry, StemDirectionType } from "./VoiceEntry";
import { SourceStaffEntry } from "./SourceStaffEntry";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { NoteEnum, Pitch } from "../../Common/DataObjects/Pitch";
import { Beam } from "./Beam";
import { Tuplet } from "./Tuplet";
import { Tie } from "./Tie";
import { Staff } from "./Staff";
import { Slur } from "./Expressions/ContinuousExpressions/Slur";
import { NoteState } from "../Graphical/DrawingEnums";
import { Notehead } from "./Notehead";
import { Arpeggio } from "./Arpeggio";
import { NoteType } from "./NoteType";
import { SourceMeasure } from "./SourceMeasure";
import { TechnicalInstruction } from "./Instructions";
import { PlaybackNote } from "../Playback/PlaybackNote";
/**
 * Represents a single pitch with a duration (length)
 */
export declare class Note {
    constructor(voiceEntry: VoiceEntry, parentStaffEntry: SourceStaffEntry, length: Fraction, pitch: Pitch, sourceMeasure: SourceMeasure, isRest?: boolean);
    /**
     * The transposed (!!!) HalfTone of this note.
     */
    halfTone: number;
    state: NoteState;
    private voiceEntry;
    private parentStaffEntry;
    private length;
    private playbackNote;
    private sourceMeasure;
    /** The length/duration given in the <type> tag. different from length for tuplets/tremolos. */
    private typeLength;
    /** The NoteType given in the XML, e.g. quarter, which can be a normal quarter or tuplet quarter -> can have different length/fraction */
    private noteTypeXml;
    /** The amount of notes the tuplet of this note (if there is one) replaces. */
    private normalNotes;
    private isRestFlag;
    /**
     * The untransposed (!!!) source data.
     */
    private pitch;
    displayStepUnpitched: NoteEnum;
    displayOctaveUnpitched: number;
    get NoteAsString(): string;
    private beam;
    private tuplet;
    private tie;
    private slurs;
    private playbackInstrumentId;
    private notehead;
    /** States whether the note should be displayed. False if xmlNode.attribute("print-object").value = "no". */
    private printObject;
    /** The Arpeggio this note is part of. */
    private arpeggio;
    /** States whether this is a cue note (Stichnote) (smaller size). */
    private isCueNote;
    IsGraceNote: boolean;
    /** The stem direction asked for in XML. Not necessarily final or wanted stem direction. */
    private stemDirectionXml;
    /** The number of tremolo strokes this note has (16th tremolo = 2 strokes).
     * Could be a Tremolo object in future when there is more data like tremolo between two notes.
     */
    private tremoloStrokes;
    /** Color of the stem given in the XML Stem tag. RGB Hexadecimal, like #00FF00.
     * This is not used for rendering, which takes VoiceEntry.StemColor.
     * It is merely given in the note's stem element in XML and stored here for reference.
     * So, to read or change the stem color of a note, modify note.ParentVoiceEntry.StemColor.
     */
    private stemColorXml;
    /** Color of the notehead given in the XML Notehead tag. RGB Hexadecimal, like #00FF00.
     * This should not be changed, instead noteheadColor is used and modifiable for Rendering.
     * Needs to be stored here and not in Note.Notehead,
     * because Note.Notehead is undefined for normal Noteheads to save space and time.
     */
    private noteheadColorXml;
    /** Color of the notehead currently set/desired for next render. RGB Hexadecimal, like #00FF00.
     * Needs to be stored here and not in Note.Notehead,
     * because Note.Notehead is undefined for normal Noteheads to save space and time.
     */
    private noteheadColor;
    private noteheadColorCurrentlyRendered;
    Fingering: TechnicalInstruction;
    StringInstruction: TechnicalInstruction;
    /** Used by GraphicalNote.FromNote(note) and osmd.rules.GNote(note) to get a GraphicalNote from a Note. */
    NoteToGraphicalNoteObjectId: number;
    get ParentVoiceEntry(): VoiceEntry;
    set ParentVoiceEntry(value: VoiceEntry);
    get ParentStaffEntry(): SourceStaffEntry;
    get ParentStaff(): Staff;
    get Length(): Fraction;
    set PlaybackNote(value: PlaybackNote);
    get PlaybackNote(): PlaybackNote;
    set Length(value: Fraction);
    get SourceMeasure(): SourceMeasure;
    get TypeLength(): Fraction;
    set TypeLength(value: Fraction);
    get NoteTypeXml(): NoteType;
    set NoteTypeXml(value: NoteType);
    get NormalNotes(): number;
    set NormalNotes(value: number);
    get Pitch(): Pitch;
    get NoteBeam(): Beam;
    set NoteBeam(value: Beam);
    set Notehead(value: Notehead);
    get Notehead(): Notehead;
    get NoteTuplet(): Tuplet;
    set NoteTuplet(value: Tuplet);
    get NoteTie(): Tie;
    set NoteTie(value: Tie);
    get NoteSlurs(): Slur[];
    set NoteSlurs(value: Slur[]);
    get PlaybackInstrumentId(): string;
    set PlaybackInstrumentId(value: string);
    get PrintObject(): boolean;
    set PrintObject(value: boolean);
    get Arpeggio(): Arpeggio;
    set Arpeggio(value: Arpeggio);
    get IsCueNote(): boolean;
    set IsCueNote(value: boolean);
    get StemDirectionXml(): StemDirectionType;
    set StemDirectionXml(value: StemDirectionType);
    get TremoloStrokes(): number;
    set TremoloStrokes(value: number);
    get StemColorXml(): string;
    set StemColorXml(value: string);
    get NoteheadColorXml(): string;
    set NoteheadColorXml(value: string);
    /** The desired notehead color for the next render. */
    get NoteheadColor(): string;
    set NoteheadColor(value: string);
    get NoteheadColorCurrentlyRendered(): string;
    set NoteheadColorCurrentlyRendered(value: string);
    isRest(): boolean;
    /** Note: May be dangerous to use if ParentStaffEntry.VerticalContainerParent etc is not set.
     * better calculate this directly when you have access to the note's measure.
     * whole rest: length = measure length. (4/4 in a 4/4 time signature, 3/4 in a 3/4 time signature, 1/4 in a 1/4 time signature, etc.)
     */
    isWholeRest(): boolean;
    ToString(): string;
    getAbsoluteTimestamp(): Fraction;
    checkForDoubleSlur(slur: Slur): boolean;
}
export declare enum Appearance {
    Normal = 0,
    Grace = 1,
    Cue = 2
}
