import { PointF2D } from "./PointF2D";
export declare class Matrix2D {
    private matrix;
    constructor();
    static getRotationMatrix(angle: number): Matrix2D;
    scalarMultiplication(scalar: number): void;
    getTransposeMatrix(): Matrix2D;
    vectorMultiplication(point: PointF2D): PointF2D;
}
