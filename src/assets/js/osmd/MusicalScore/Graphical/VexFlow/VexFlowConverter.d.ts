import Vex from "vexflow";
import { ClefEnum } from "../../VoiceData/Instructions/ClefInstruction";
import { ClefInstruction } from "../../VoiceData/Instructions/ClefInstruction";
import { Pitch } from "../../../Common/DataObjects/Pitch";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { RhythmInstruction } from "../../VoiceData/Instructions/RhythmInstruction";
import { KeyInstruction } from "../../VoiceData/Instructions/KeyInstruction";
import { SystemLinesEnum } from "../SystemLinesEnum";
import { FontStyles } from "../../../Common/Enums/FontStyles";
import { Fonts } from "../../../Common/Enums/Fonts";
import { OutlineAndFillStyleEnum } from "../DrawingEnums";
import { SystemLinePosition } from "../SystemLinePosition";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
import { OrnamentContainer } from "../../VoiceData/OrnamentContainer";
import { Notehead } from "../../VoiceData/Notehead";
import { EngravingRules } from "../EngravingRules";
import { ArpeggioType } from "../../VoiceData/Arpeggio";
import { Articulation } from "../../VoiceData/Articulation";
/**
 * Helper class, which contains static methods which actually convert
 * from OSMD objects to VexFlow objects.
 */
export declare class VexFlowConverter {
    /**
     * Mapping from numbers of alterations on the key signature to major keys
     * @type {[alterationsNo: number]: string; }
     */
    private static majorMap;
    /**
     * Mapping from numbers of alterations on the key signature to minor keys
     * @type {[alterationsNo: number]: string; }
     */
    private static minorMap;
    /**
     * Convert a fraction to a string which represents a duration in VexFlow
     * @param fraction a fraction representing the duration of a note
     * @returns {string}
     */
    static duration(fraction: Fraction, isTuplet: boolean): string;
    /**
     * Takes a Pitch and returns a string representing a VexFlow pitch,
     * which has the form "b/4", plus its alteration (accidental)
     * @param pitch
     * @returns {string[]}
     */
    static pitch(pitch: Pitch, isRest: boolean, clef: ClefInstruction, notehead?: Notehead): [string, string, ClefInstruction];
    static restToNotePitch(pitch: Pitch, clefType: ClefEnum): Pitch;
    /** returns the Vexflow code for a note head. Some are still unsupported, see Vexflow/tables.js */
    static NoteHeadCode(notehead: Notehead): string;
    static GhostNote(frac: Fraction): Vex.Flow.GhostNote;
    /**
     * Convert a GraphicalVoiceEntry to a VexFlow StaveNote
     * @param gve the GraphicalVoiceEntry which can hold a note or a chord on the staff belonging to one voice
     * @returns {Vex.Flow.StaveNote}
     */
    static StaveNote(gve: GraphicalVoiceEntry): Vex.Flow.StaveNote;
    static generateArticulations(vfnote: Vex.Flow.StemmableNote, articulations: Articulation[], rules: EngravingRules): void;
    static generateOrnaments(vfnote: Vex.Flow.StemmableNote, oContainer: OrnamentContainer): void;
    static StrokeTypeFromArpeggioType(arpeggioType: ArpeggioType): Vex.Flow.Stroke.Type;
    /**
     * Convert a set of GraphicalNotes to a VexFlow StaveNote
     * @param notes form a chord on the staff
     * @returns {Vex.Flow.StaveNote}
     */
    static CreateTabNote(gve: GraphicalVoiceEntry): Vex.Flow.TabNote;
    /**
     * Convert a ClefInstruction to a string represention of a clef type in VexFlow.
     *
     * @param clef The OSMD object to be converted representing the clef
     * @param size The VexFlow size to be used. Can be `default` or `small`.
     * As soon as #118 is done, this parameter will be dispensable.
     * @returns    A string representation of a VexFlow clef
     * @see        https://github.com/0xfe/vexflow/blob/master/src/clef.js
     * @see        https://github.com/0xfe/vexflow/blob/master/tests/clef_tests.js
     */
    static Clef(clef: ClefInstruction, size?: string): {
        type: string;
        size: string;
        annotation: string;
    };
    /**
     * Convert a RhythmInstruction to a VexFlow TimeSignature object
     * @param rhythm
     * @returns {Vex.Flow.TimeSignature}
     * @constructor
     */
    static TimeSignature(rhythm: RhythmInstruction): Vex.Flow.TimeSignature;
    /**
     * Convert a KeyInstruction to a string representing in VexFlow a key
     * @param key
     * @returns {string}
     */
    static keySignature(key: KeyInstruction): string;
    /**
     * Converts a lineType to a VexFlow StaveConnector type
     * @param lineType
     * @returns {any}
     */
    static line(lineType: SystemLinesEnum, linePosition: SystemLinePosition): any;
    /**
     * Construct a string which can be used in a CSS font property
     * @param fontSize
     * @param fontStyle
     * @param font
     * @returns {string}
     */
    static font(fontSize: number, fontStyle: FontStyles, font: Fonts, rules: EngravingRules, fontFamily?: string): string;
    /**
     * Converts the style into a string that VexFlow RenderContext can understand
     * as the weight of the font
     */
    static fontStyle(style: FontStyles): string;
    /**
     * Convert OutlineAndFillStyle to CSS properties
     * @param styleId
     * @returns {string}
     */
    static style(styleId: OutlineAndFillStyleEnum): string;
}
