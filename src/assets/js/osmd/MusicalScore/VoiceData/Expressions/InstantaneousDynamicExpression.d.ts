import { PlacementEnum, AbstractExpression } from "./AbstractExpression";
import { MultiExpression } from "./MultiExpression";
import { DynamicExpressionSymbolEnum } from "./DynamicExpressionSymbolEnum";
import { SourceMeasure } from "../SourceMeasure";
import { Dictionary } from "typescript-collections";
export declare class InstantaneousDynamicExpression extends AbstractExpression {
    static staticConstructor(): void;
    constructor(dynamicExpression: string, soundDynamics: number, placement: PlacementEnum, staffNumber: number, measure: SourceMeasure);
    static dynamicToRelativeVolumeDict: Dictionary<DynamicEnum, number>;
    private multiExpression;
    private dynamicEnum;
    private soundDynamic;
    private staffNumber;
    private length;
    get ParentMultiExpression(): MultiExpression;
    set ParentMultiExpression(value: MultiExpression);
    get DynEnum(): DynamicEnum;
    set DynEnum(value: DynamicEnum);
    get SoundDynamic(): number;
    set SoundDynamic(value: number);
    get Placement(): PlacementEnum;
    set Placement(value: PlacementEnum);
    get StaffNumber(): number;
    set StaffNumber(value: number);
    get Length(): number;
    get MidiVolume(): number;
    get Volume(): number;
    static isInputStringInstantaneousDynamic(inputString: string): boolean;
    private static listInstantaneousDynamics;
    getDynamicExpressionSymbol(c: string): DynamicExpressionSymbolEnum;
    private calculateLength;
}
export declare enum DynamicEnum {
    pppppp = 0,
    ppppp = 1,
    pppp = 2,
    ppp = 3,
    pp = 4,
    p = 5,
    mp = 6,
    mf = 7,
    f = 8,
    ff = 9,
    fff = 10,
    ffff = 11,
    fffff = 12,
    ffffff = 13,
    sf = 14,
    sff = 15,
    sfp = 16,
    sfpp = 17,
    fp = 18,
    rf = 19,
    rfz = 20,
    sfz = 21,
    sffz = 22,
    fz = 23,
    other = 24
}
