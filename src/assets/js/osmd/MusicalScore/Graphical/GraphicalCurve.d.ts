import { PointF2D } from "../../Common/DataObjects/PointF2D";
export declare class GraphicalCurve {
    private static bezierCurveStepSize;
    private static tPow3;
    private static oneMinusTPow3;
    private static bezierFactorOne;
    private static bezierFactorTwo;
    constructor();
    bezierStartPt: PointF2D;
    bezierStartControlPt: PointF2D;
    bezierEndControlPt: PointF2D;
    bezierEndPt: PointF2D;
    /**
     *
     * @param relativePosition
     */
    calculateCurvePointAtIndex(relativePosition: number): PointF2D;
}
