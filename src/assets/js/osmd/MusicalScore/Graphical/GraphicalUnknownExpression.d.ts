import { StaffLine } from "./StaffLine";
import { GraphicalLabel } from "./GraphicalLabel";
import { AbstractGraphicalExpression } from "./AbstractGraphicalExpression";
import { PlacementEnum } from "../VoiceData/Expressions/AbstractExpression";
import { MultiExpression } from "../VoiceData/Expressions/MultiExpression";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
export declare class GraphicalUnknownExpression extends AbstractGraphicalExpression {
    sourceMultiExpression: MultiExpression;
    constructor(staffLine: StaffLine, label: GraphicalLabel, placement: PlacementEnum, measure: SourceMeasure, sourceMultiExpression?: MultiExpression);
    updateSkyBottomLine(): void;
}
