import { GraphicalContinuousDynamicExpression } from "../GraphicalContinuousDynamicExpression";
import { ContinuousDynamicExpression } from "../../VoiceData/Expressions/ContinuousExpressions/ContinuousDynamicExpression";
import { StaffLine } from "../StaffLine";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
/**
 * This class extends the GraphicalContinuousDynamicExpression and creates all necessary methods for drawing
 */
export declare class VexFlowContinuousDynamicExpression extends GraphicalContinuousDynamicExpression {
    constructor(continuousDynamic: ContinuousDynamicExpression, staffLine: StaffLine, measure: SourceMeasure, textHeight?: number);
}
