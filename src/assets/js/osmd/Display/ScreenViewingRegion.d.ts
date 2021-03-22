import { BoundingBox } from "../MusicalScore/Graphical";
import { SizeF2D, PointF2D } from "../Common/DataObjects";
export declare class ScreenViewingRegion {
    constructor(displaySizeInPixel: SizeF2D, relativeSizeOfRegionInDisplay: SizeF2D, relativePositionOfRegionInDisplay: PointF2D, regionWidthInUnits: number);
    static createWithRelativeDefaults(displaySizeInPixel: SizeF2D, regionWidthInUnits: number): ScreenViewingRegion;
    static createWithDefaults(): ScreenViewingRegion;
    RelativeDisplayPosition: PointF2D;
    get UpperLeftPositionInUnits(): PointF2D;
    set UpperLeftPositionInUnits(value: PointF2D);
    get DisplaySizeInPixel(): SizeF2D;
    set DisplaySizeInPixel(value: SizeF2D);
    get RelativeDisplaySize(): SizeF2D;
    set RelativeDisplaySize(value: SizeF2D);
    get RegionSizeInPixel(): SizeF2D;
    get WidthInUnits(): number;
    set WidthInUnits(value: number);
    get ViewRegionInUnits(): SizeF2D;
    isVisible(psi: BoundingBox, isCompletelyInside: boolean): boolean;
    /** This visible check takes care of the 4 ClipOnIntersectionWith.... flags
     * If a flag is set, all objects that reach over the corresponding border will not be "visible" and the method returns false.
     */
    isInsideDisplayArea(relativeDisplayPosX: number, relativeDisplayPosY: number): boolean;
    /**
     * @param relativeScreenPosition The relative position on the whole screen,
     * not on the ScreenViewingRegion (only if the region stretches over the whole screen).
     */
    transformToUnitCoordinates(relativeScreenPosition: PointF2D): PointF2D;
    transformLengthXToUnitCoordinates(lengthXInPixels: number): number;
    transformLengthYToUnitCoordinates(lengthYInPixels: number): number;
    private recalculateDependentVariables;
    private displaySizeInPixel;
    private regionSizeInPixel;
    private relativeRegionSize;
    private horizontalUnitToPixelRatio;
    private verticalUnitToPixelRatio;
    private psi;
}
