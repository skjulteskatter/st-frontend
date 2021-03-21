import { StaffLine } from "./StaffLine";
import { PointF2D } from "../../Common/DataObjects/PointF2D";
import { BoundingBox } from "./BoundingBox";
/**
 * This class calculates and holds the skyline and bottom line information.
 * It also has functions to update areas of the two lines if new elements are
 * added to the staffline (e.g. measure number, annotations, ...)
 */
export declare class SkyBottomLineCalculator {
    /** Parent Staffline where the skyline and bottom line is attached */
    private mStaffLineParent;
    /** Internal array for the skyline */
    private mSkyLine;
    /** Internal array for the bottomline */
    private mBottomLine;
    /** Engraving rules for formatting */
    private mRules;
    /**
     * Create a new object of the calculator
     * @param staffLineParent staffline where the calculator should be attached
     */
    constructor(staffLineParent: StaffLine);
    /**
     * This method calculates the Sky- and BottomLines for a StaffLine.
     */
    calculateLines(): void;
    /**
     * go backwards through the skyline array and find a number so that
     * we can properly calculate the average
     * @param start
     * @param backend
     * @param color
     */
    private findPreviousValidNumber;
    /**
     * go forward through the skyline array and find a number so that
     * we can properly calculate the average
     * @param start
     * @param backend
     * @param color
     */
    private findNextValidNumber;
    /**
     * Debugging drawing function that can draw single pixels
     * @param coord Point to draw to
     * @param backend the backend to be used
     * @param color the color to be used, default is red
     */
    private drawPixel;
    /**
     * This method updates the SkyLine for a given Wedge.
     * @param start Start point of the wedge (the point where both lines meet)
     * @param end End point of the wedge (the end of the most extreme line: upper line for skyline, lower line for bottomline)
     */
    updateSkyLineWithWedge(start: PointF2D, end: PointF2D): void;
    /**
     * This method updates the BottomLine for a given Wedge.
     * @param start Start point of the wedge
     * @param end End point of the wedge
     */
    updateBottomLineWithWedge(start: PointF2D, end: PointF2D): void;
    /**
     * This method updates the SkyLine for a given range with a given value
     * //param  to update the SkyLine for
     * @param start Start index of the range
     * @param end End index of the range
     * @param value ??
     */
    updateSkyLineInRange(startIndex: number, endIndex: number, value: number): void;
    /**
     * This method updates the BottomLine for a given range with a given value
     * @param  to update the BottomLine for
     * @param start Start index of the range
     * @param end End index of the range (excluding)
     * @param value ??
     */
    updateBottomLineInRange(startIndex: number, endIndex: number, value: number): void;
    /**
     * Resets a SkyLine in a range to its original value
     * @param  to reset the SkyLine in
     * @param startIndex Start index of the range
     * @param endIndex End index of the range (excluding)
     */
    resetSkyLineInRange(startIndex: number, endIndex: number): void;
    /**
     * Resets a bottom line in a range to its original value
     * @param  to reset the bottomline in
     * @param startIndex Start index of the range
     * @param endIndex End index of the range
     */
    resetBottomLineInRange(startIndex: number, endIndex: number): void;
    /**
     * Update the whole skyline with a certain value
     * @param value value to be set
     */
    setSkyLineWithValue(value: number): void;
    /**
     * Update the whole bottomline with a certain value
     * @param value value to be set
     */
    setBottomLineWithValue(value: number): void;
    getLeftIndexForPointX(x: number, length: number): number;
    getRightIndexForPointX(x: number, length: number): number;
    /**
     * This method updates the StaffLine Borders with the Sky- and BottomLines Min- and MaxValues.
     */
    updateStaffLineBorders(): void;
    /**
     * This method finds the minimum value of the SkyLine.
     * @param staffLine StaffLine to apply to
     */
    getSkyLineMin(): number;
    getSkyLineMinAtPoint(point: number): number;
    /**
     * This method finds the SkyLine's minimum value within a given range.
     * @param staffLine Staffline to apply to
     * @param startIndex Starting index
     * @param endIndex End index (including)
     */
    getSkyLineMinInRange(startIndex: number, endIndex: number): number;
    /**
     * This method finds the maximum value of the BottomLine.
     * @param staffLine Staffline to apply to
     */
    getBottomLineMax(): number;
    getBottomLineMaxAtPoint(point: number): number;
    /**
     * This method finds the BottomLine's maximum value within a given range.
     * @param staffLine Staffline to find the max value in
     * @param startIndex Start index of the range
     * @param endIndex End index of the range (excluding)
     */
    getBottomLineMaxInRange(startIndex: number, endIndex: number): number;
    /**
     * This method returns the maximum value of the bottom line around a specific
     * bounding box. Will return undefined if the bounding box is not valid or inside staffline
     * @param boundingBox Bounding box where the maximum should be retrieved from
     * @returns Maximum value inside bounding box boundaries or undefined if not possible
     */
    getBottomLineMaxInBoundingBox(boundingBox: BoundingBox): number;
    /**
     * Updates sky- and bottom line with a boundingBox and its children
     * @param boundingBox Bounding box to be added
     * @param topBorder top
     */
    updateWithBoundingBoxRecursively(boundingBox: BoundingBox): void;
    /**
     * Update an array with the value given inside a range. NOTE: will only be updated if value > oldValue
     * @param array Array to fill in the new value
     * @param startIndex start index to begin with (default: 0)
     * @param endIndex end index of array (excluding, default: array length)
     * @param value value to fill in (default: 0)
     */
    private updateInRange;
    /**
     * Sets the value given to the range inside the array. NOTE: will always update the value
     * @param array Array to fill in the new value
     * @param startIndex start index to begin with (default: 0)
     * @param endIndex end index of array (excluding, default: array length)
     * @param value value to fill in (default: 0)
     */
    private setInRange;
    /**
     * Get all values of the selected line inside the given range
     * @param skyBottomArray Skyline or bottom line
     * @param startIndex start index
     * @param endIndex end index (including)
     */
    private getMinInRange;
    /**
     * Get the maximum value inside the given indices
     * @param skyBottomArray Skyline or bottom line
     * @param startIndex start index
     * @param endIndex end index (including)
     */
    private getMaxInRange;
    /** Sampling units that are used to quantize the sky and bottom line  */
    get SamplingUnit(): number;
    /** Parent staffline where the skybottomline calculator is attached to */
    get StaffLineParent(): StaffLine;
    /** Get the plain skyline array */
    get SkyLine(): number[];
    /** Get the plain bottomline array */
    get BottomLine(): number[];
}
