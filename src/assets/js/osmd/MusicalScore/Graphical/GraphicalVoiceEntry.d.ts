import { GraphicalObject } from "./GraphicalObject";
import { VoiceEntry } from "../VoiceData/VoiceEntry";
import { GraphicalNote } from "./GraphicalNote";
import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
import { OctaveEnum } from "../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { EngravingRules } from "./EngravingRules";
/**
 * The graphical counterpart of a [[VoiceEntry]].
 */
export declare class GraphicalVoiceEntry extends GraphicalObject {
    constructor(parentVoiceEntry: VoiceEntry, parentStaffEntry: GraphicalStaffEntry);
    parentVoiceEntry: VoiceEntry;
    parentStaffEntry: GraphicalStaffEntry;
    notes: GraphicalNote[];
    /** Contains octave shifts affecting this voice entry, caused by octave brackets. */
    octaveShiftValue: OctaveEnum;
    protected rules: EngravingRules;
    /** Sort this entry's notes by pitch.
     * Notes need to be sorted for Vexflow StaveNote creation.
     * Note that Vexflow needs the reverse order, see VexFlowConverter.StaveNote().
     */
    sort(): GraphicalNote[];
    /** Sort notes for vexflow (bottom to top), which needs them in the reverse order OSMD likes to have them.
     *  Note that sort() and reverse() replace the array in place,
     *  so to avoid changing the array one could copy it first, see sortedNotesCopyForVexflow() (commented),
     *  though copying the array is also unnecessary (time+memory) for now.
     */
    sortForVexflow(): GraphicalNote[];
    /** (Re-)color notes and stems
     */
    color(): void;
}
