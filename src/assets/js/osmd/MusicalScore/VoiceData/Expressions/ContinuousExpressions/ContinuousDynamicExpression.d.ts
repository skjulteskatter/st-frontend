import { PlacementEnum, AbstractExpression } from "../AbstractExpression";
import { MultiExpression } from "../MultiExpression";
import { Fraction } from "../../../../Common/DataObjects/Fraction";
import { SourceMeasure } from "../../SourceMeasure";
import { InstantaneousDynamicExpression } from "../InstantaneousDynamicExpression";
export declare class ContinuousDynamicExpression extends AbstractExpression {
    constructor(dynamicType: ContDynamicEnum, placement: PlacementEnum, staffNumber: number, measure: SourceMeasure, activeInstantaneousDynamic: InstantaneousDynamicExpression, label?: string);
    private static listContinuousDynamicIncreasing;
    private static listContinuousDynamicDecreasing;
    private dynamicType;
    private startMultiExpression;
    private endMultiExpression;
    private startVolume;
    private endVolume;
    private staffNumber;
    private label;
    private activeInstantaneousDynamic;
    setStartAndEndVolume(): void;
    get DynamicType(): ContDynamicEnum;
    set DynamicType(value: ContDynamicEnum);
    get StartMultiExpression(): MultiExpression;
    set StartMultiExpression(value: MultiExpression);
    get EndMultiExpression(): MultiExpression;
    set EndMultiExpression(value: MultiExpression);
    get Placement(): PlacementEnum;
    set Placement(value: PlacementEnum);
    get StartVolume(): number;
    set StartVolume(value: number);
    get EndVolume(): number;
    set EndVolume(value: number);
    get StaffNumber(): number;
    set StaffNumber(value: number);
    get Label(): string;
    set Label(value: string);
    static isInputStringContinuousDynamic(inputString: string): boolean;
    getInterpolatedDynamic(currentAbsoluteTimestamp: Fraction): number;
    isWedge(): boolean;
    private setType;
}
export declare enum ContDynamicEnum {
    crescendo = 0,
    /** Diminuendo/Decrescendo. These terms are apparently sometimes synonyms, and a falling wedge is given in MusicXML as type="diminuendo". */
    diminuendo = 1
}
