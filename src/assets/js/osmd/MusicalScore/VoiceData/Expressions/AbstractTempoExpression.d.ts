import { PlacementEnum, AbstractExpression } from "./AbstractExpression";
import { MultiTempoExpression } from "./MultiTempoExpression";
export declare abstract class AbstractTempoExpression extends AbstractExpression {
    constructor(label: string, placement: PlacementEnum, staffNumber: number, parentMultiTempoExpression: MultiTempoExpression);
    protected label: string;
    protected staffNumber: number;
    protected parentMultiTempoExpression: MultiTempoExpression;
    get Label(): string;
    set Label(value: string);
    get Placement(): PlacementEnum;
    set Placement(value: PlacementEnum);
    get StaffNumber(): number;
    set StaffNumber(value: number);
    get ParentMultiTempoExpression(): MultiTempoExpression;
    protected static isStringInStringList(wordsToFind: string[], inputString: string): boolean;
    private static stringContainsSeparatedWord;
}
