/**
 * Represents a color in RGBA
 */
export declare class OSMDColor {
    alpha: number;
    red: number;
    green: number;
    blue: number;
    constructor(red: number, green: number, blue: number);
    static get Black(): OSMDColor;
    static get DeepSkyBlue(): OSMDColor;
    static get Green(): OSMDColor;
    static get Magenta(): OSMDColor;
    static get Orange(): OSMDColor;
    static get Red(): OSMDColor;
    static get Disabled(): OSMDColor;
    static get DarkBlue(): OSMDColor;
    static get Debug1(): OSMDColor;
    static get Debug2(): OSMDColor;
    static get Debug3(): OSMDColor;
    toHexString(): string;
    toString(): string;
}
