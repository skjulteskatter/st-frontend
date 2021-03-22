import { AbstractTempoExpression } from "../VoiceData/Expressions/AbstractTempoExpression";
import { GraphicalLabel } from "./GraphicalLabel";
import { AbstractGraphicalExpression } from "./AbstractGraphicalExpression";
export declare class GraphicalInstantaneousTempoExpression extends AbstractGraphicalExpression {
    constructor(tempoExpresssion: AbstractTempoExpression, label: GraphicalLabel);
    get GraphicalLabel(): GraphicalLabel;
    updateSkyBottomLine(): void;
}
