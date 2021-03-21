import { GraphicalObject } from "./GraphicalObject";
import { GraphicalLabel } from "./GraphicalLabel";
import { StaffLine } from "./StaffLine";
import { AbstractExpression, PlacementEnum } from "../VoiceData/Expressions/AbstractExpression";
import { EngravingRules } from "./EngravingRules";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
export declare abstract class AbstractGraphicalExpression extends GraphicalObject {
    protected label: GraphicalLabel;
    protected parentStaffLine: StaffLine;
    /** Internal cache of read expression */
    protected expression: AbstractExpression;
    /** EngravingRules for positioning */
    protected rules: EngravingRules;
    protected parentMeasure: SourceMeasure;
    constructor(parentStaffline: StaffLine, expression: AbstractExpression, measure: SourceMeasure);
    /** Graphical label of the expression if available */
    get Label(): GraphicalLabel;
    /** Staffline where the expression is attached to */
    get ParentStaffLine(): StaffLine;
    get SourceExpression(): AbstractExpression;
    get Placement(): PlacementEnum;
    abstract updateSkyBottomLine(): void;
}
