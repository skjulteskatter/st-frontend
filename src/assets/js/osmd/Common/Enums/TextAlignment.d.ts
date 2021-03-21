/**
 * The Alignment of a TextLabel.
 * Specifically the label's position coordinates within the Bounding Box.
 * For LeftBottom, the label's position is at the left bottom corner of its Bounding Box.
 * (used for example with title, composer, author, etc.)
 * (see Show Bounding Box For -> Labels in the local demo)
 */
export declare enum TextAlignmentEnum {
    LeftTop = 0,
    LeftCenter = 1,
    LeftBottom = 2,
    CenterTop = 3,
    CenterCenter = 4,
    CenterBottom = 5,
    RightTop = 6,
    RightCenter = 7,
    RightBottom = 8
}
export declare class TextAlignment {
    static IsLeft(textAlignment: TextAlignmentEnum): boolean;
    static IsCenterAligned(textAlignment: TextAlignmentEnum): boolean;
    static IsRight(textAlignment: TextAlignmentEnum): boolean;
}
