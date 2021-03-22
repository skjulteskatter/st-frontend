import { SizeF2D } from "./SizeF2D";
import { PointF2D } from "./PointF2D";
/**
 * Represent a rectangle on a plane
 */
export declare class RectangleF2D {
    x: number;
    y: number;
    width: number;
    height: number;
    /**
     *
     * @param x
     * @param y
     * @param width
     * @param height
     */
    constructor(x: number, y: number, width: number, height: number);
    static createFromLocationAndSize(location: PointF2D, size: SizeF2D): RectangleF2D;
    get Location(): PointF2D;
    get Size(): SizeF2D;
}
