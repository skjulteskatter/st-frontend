export declare enum SystemLinesEnum {
    SingleThin = 0,
    DoubleThin = 1,
    ThinBold = 2,
    BoldThinDots = 3,
    DotsThinBold = 4,
    DotsBoldBoldDots = 5,
    None = 6,
    Dotted = 7,
    Dashed = 8,
    Bold = 9,
    BoldThin = 10,
    DoubleBold = 11,
    Tick = 12,
    Short = 13
}
export declare class SystemLinesEnumHelper {
    static xmlBarlineStyleToSystemLinesEnum(xmlValue: string): SystemLinesEnum;
}
