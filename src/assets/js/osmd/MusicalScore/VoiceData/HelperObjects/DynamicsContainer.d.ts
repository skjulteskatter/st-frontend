import { ContinuousDynamicExpression } from "../Expressions/ContinuousExpressions/ContinuousDynamicExpression";
import { InstantaneousDynamicExpression } from "../Expressions/InstantaneousDynamicExpression";
import { MultiExpression } from "../Expressions/MultiExpression";
export declare class DynamicsContainer {
    constructor(dynamicExpression: ContinuousDynamicExpression | InstantaneousDynamicExpression, staffNumber: number);
    static Compare(a: DynamicsContainer, b: DynamicsContainer): number;
    continuousDynamicExpression: ContinuousDynamicExpression;
    instantaneousDynamicExpression: InstantaneousDynamicExpression;
    staffNumber: number;
    parMultiExpression(): MultiExpression;
}
