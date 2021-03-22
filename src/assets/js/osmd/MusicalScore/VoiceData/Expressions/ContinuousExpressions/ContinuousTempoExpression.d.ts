import { Fraction } from "../../../../Common/DataObjects/Fraction";
import { PlacementEnum } from "../AbstractExpression";
import { MultiTempoExpression } from "../MultiTempoExpression";
import { AbstractTempoExpression } from "../AbstractTempoExpression";
export declare class ContinuousTempoExpression extends AbstractTempoExpression {
    constructor(label: string, placement: PlacementEnum, staffNumber: number, parentMultiTempoExpression: MultiTempoExpression);
    private static listContinuousTempoFaster;
    private static listContinuousTempoSlower;
    private absoluteEndTimestamp;
    private tempoType;
    private startTempo;
    private endTempo;
    static isInputStringContinuousTempo(inputString: string): boolean;
    static isIncreasingTempo(tempoType: ContinuousTempoType): boolean;
    static isDecreasingTempo(tempoType: ContinuousTempoType): boolean;
    get TempoType(): ContinuousTempoType;
    set TempoType(value: ContinuousTempoType);
    get StartTempo(): number;
    set StartTempo(value: number);
    get EndTempo(): number;
    set EndTempo(value: number);
    get AbsoluteEndTimestamp(): Fraction;
    set AbsoluteEndTimestamp(value: Fraction);
    get AbsoluteTimestamp(): Fraction;
    getAbsoluteFloatTimestamp(): number;
    getInterpolatedTempo(currentAbsoluteTimestamp: Fraction): number;
    private setTempoType;
}
export declare enum ContinuousTempoType {
    accelerando = 0,
    stretto = 1,
    stringendo = 2,
    mosso = 3,
    piuMosso = 4,
    allargando = 5,
    calando = 6,
    menoMosso = 7,
    rallentando = 8,
    ritardando = 9,
    ritard = 10,
    rit = 11,
    ritenuto = 12,
    rubato = 13,
    precipitando = 14
}
