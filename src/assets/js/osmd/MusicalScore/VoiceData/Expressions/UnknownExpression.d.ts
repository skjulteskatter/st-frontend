import { PlacementEnum, AbstractExpression } from "./AbstractExpression";
import { TextAlignmentEnum } from "../../../Common/Enums/TextAlignment";
import { FontStyles } from "../../../Common/Enums/FontStyles";
export declare class UnknownExpression extends AbstractExpression {
    constructor(label: string, placement: PlacementEnum, textAlignment: TextAlignmentEnum, staffNumber: number);
    private label;
    private textAlignment;
    private staffNumber;
    fontStyle: FontStyles;
    get Label(): string;
    get Placement(): PlacementEnum;
    set Placement(value: PlacementEnum);
    get StaffNumber(): number;
    set StaffNumber(value: number);
    get TextAlignment(): TextAlignmentEnum;
}
