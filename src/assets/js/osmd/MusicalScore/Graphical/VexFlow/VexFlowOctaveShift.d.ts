import Vex from "vexflow";
import { GraphicalOctaveShift } from "../GraphicalOctaveShift";
import { OctaveShift } from "../../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { BoundingBox } from "../BoundingBox";
import { GraphicalStaffEntry } from "../GraphicalStaffEntry";
/**
 * The vexflow adaptation of a graphical shift.
 */
export declare class VexFlowOctaveShift extends GraphicalOctaveShift {
    /** Defines the note where the octave shift starts */
    startNote: Vex.Flow.StemmableNote;
    /** Defines the note where the octave shift ends */
    endNote: Vex.Flow.StemmableNote;
    /** Top or bottom of the staffline */
    private position;
    /** Supscript is a smaller text after the regular text (e.g. va after 8) */
    private supscript;
    /** Main text element */
    private text;
    /**
     * Create a new vexflow ocatve shift
     * @param octaveShift the object read by the ExpressionReader
     * @param parent the bounding box of the parent
     */
    constructor(octaveShift: OctaveShift, parent: BoundingBox);
    /**
     * Set a start note using a staff entry
     * @param graphicalStaffEntry the staff entry that holds the start note
     */
    setStartNote(graphicalStaffEntry: GraphicalStaffEntry): boolean;
    /**
     * Set an end note using a staff entry
     * @param graphicalStaffEntry the staff entry that holds the end note
     */
    setEndNote(graphicalStaffEntry: GraphicalStaffEntry): boolean;
    /**
     * Get the actual vexflow text bracket used for drawing
     */
    getTextBracket(): Vex.Flow.TextBracket;
}
