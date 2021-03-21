import { Fraction } from "../../../Common/DataObjects/Fraction";
import { SourceMeasure } from "../SourceMeasure";
import { InstantaneousTempoExpression } from "./InstantaneousTempoExpression";
import { PlacementEnum } from "./AbstractExpression";
import { FontStyles } from "../../../Common/Enums/FontStyles";
import { AbstractTempoExpression } from "./AbstractTempoExpression";
import { ContinuousTempoExpression } from "./ContinuousExpressions/ContinuousTempoExpression";
export declare class MultiTempoExpression {
    constructor(sourceMeasure: SourceMeasure, timestamp: Fraction);
    private timestamp;
    private sourceMeasure;
    private instantaneousTempo;
    private continuousTempo;
    private expressions;
    private combinedExpressionsText;
    get Timestamp(): Fraction;
    get AbsoluteTimestamp(): Fraction;
    get SourceMeasureParent(): SourceMeasure;
    set SourceMeasureParent(value: SourceMeasure);
    get InstantaneousTempo(): InstantaneousTempoExpression;
    get ContinuousTempo(): ContinuousTempoExpression;
    get EntriesList(): TempoExpressionEntry[];
    get CombinedExpressionsText(): string;
    set CombinedExpressionsText(value: string);
    getPlacementOfFirstEntry(): PlacementEnum;
    getFontstyleOfFirstEntry(): FontStyles;
    addExpression(abstractTempoExpression: AbstractTempoExpression, prefix: string): void;
    CompareTo(other: MultiTempoExpression): number;
    private checkIfAlreadyExists;
}
export declare class TempoExpressionEntry {
    prefix: string;
    protected expression: AbstractTempoExpression;
    label: string;
    get Expression(): AbstractTempoExpression;
    set Expression(value: AbstractTempoExpression);
}
