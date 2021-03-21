import { OutlineAndFillStyleEnum } from "./DrawingEnums";
import { PointF2D } from "../../Common/DataObjects/PointF2D";
export declare class GraphicalLine {
    constructor(start: PointF2D, end: PointF2D, width?: number, styleEnum?: OutlineAndFillStyleEnum, colorHex?: string);
    styleId: number;
    private start;
    private end;
    private width;
    colorHex: string;
    get Start(): PointF2D;
    set Start(value: PointF2D);
    get End(): PointF2D;
    set End(value: PointF2D);
    get Width(): number;
    set Width(value: number);
}
