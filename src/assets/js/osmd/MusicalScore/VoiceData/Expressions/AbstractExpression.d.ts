import { SourceMeasure } from "../SourceMeasure";
export declare class AbstractExpression {
    protected placement: PlacementEnum;
    parentMeasure: SourceMeasure;
    constructor(placement: PlacementEnum);
    protected static isStringInStringList(stringList: Array<string>, inputString: string): boolean;
    /** Placement of the expression */
    get Placement(): PlacementEnum;
    static PlacementEnumFromString(placementString: string): PlacementEnum;
}
export declare enum PlacementEnum {
    Above = 0,
    Below = 1,
    Left = 2,
    Right = 3,
    NotYetDefined = 4
}
