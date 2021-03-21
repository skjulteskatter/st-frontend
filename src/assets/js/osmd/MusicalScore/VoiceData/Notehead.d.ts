import { Note } from "./Note";
/**
 * A note head with shape and fill information belonging to a [[Note]].
 */
export declare class Notehead {
    /**
     * @param sourceNote
     * @param shapeTypeXml The shape type given from XML.
     *                     See https://usermanuals.musicxml.com/MusicXML/Content/ST-MusicXML-notehead-value.htm
     * @param filledXml The XML flag to fill the note shape. Can be undefined if not included in XML.
     *                  If undefined, the filled parameter will be calculated by note duration (d < half note => filled)
     */
    constructor(sourceNote: Note, shapeTypeXml: string, filledXml?: boolean);
    /** shape of the note head (normal, square, triangle, etc.) */
    private shape;
    private filled;
    /** the [[Note]] this NoteHead belongs to. */
    private sourceNote;
    /** Sets the note head's shape from XML parameters.
     * @param shapeTypeXml The XML shape.
     * @param filledXmlAttribute the filled parameter as given in XML.
     *                           Can be undefined if not given in XML or if it should be calculated from note duration.
     *                           If undefined, this.sourceNote should not be undefined.
     */
    setShapeFromXml(shapeTypeXml: string, filledXmlAttribute?: boolean): void;
    get SourceNote(): Note;
    get Shape(): NoteHeadShape;
    get Filled(): boolean;
    /** Converts xml attribute to NoteHeadShape.
     * Necessary because "circle-x" is not a valid enum member name.
     */
    static ShapeTypeXmlToShape(shapeTypeXml: string): NoteHeadShape;
}
/** shape of a note head, needs to be supported by MusicXML and Vexflow. */
export declare enum NoteHeadShape {
    CIRCLEX = 0,
    DIAMOND = 1,
    NORMAL = 2,
    RECTANGLE = 3,
    SLASH = 4,
    SQUARE = 5,
    TRIANGLE = 6,
    X = 7
}
