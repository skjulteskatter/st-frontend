import { StaffLine } from "./StaffLine";
import { InstantaneousDynamicExpression } from "../VoiceData/Expressions/InstantaneousDynamicExpression";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { AbstractGraphicalExpression } from "./AbstractGraphicalExpression";
export declare class GraphicalInstantaneousDynamicExpression extends AbstractGraphicalExpression {
    protected mInstantaneousDynamicExpression: InstantaneousDynamicExpression;
    protected mMeasure: GraphicalMeasure;
    constructor(instantaneousDynamic: InstantaneousDynamicExpression, staffLine: StaffLine, measure: GraphicalMeasure);
    updateSkyBottomLine(): void;
}
