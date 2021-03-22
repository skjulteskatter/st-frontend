import { AbstractTempoExpression } from "./AbstractTempoExpression";
import { PlacementEnum } from "./AbstractExpression";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { MultiTempoExpression } from "./MultiTempoExpression";
export declare class InstantaneousTempoExpression extends AbstractTempoExpression {
    constructor(label: string, placement: PlacementEnum, staffNumber: number, soundTempo: number, parentMultiTempoExpression: MultiTempoExpression, isMetronomeMark?: boolean);
    dotted: boolean;
    beatUnit: string;
    private static listInstantaneousTempoLarghissimo;
    private static listInstantaneousTempoGrave;
    private static listInstantaneousTempoLento;
    private static listInstantaneousTempoLargo;
    private static listInstantaneousTempoLarghetto;
    private static listInstantaneousTempoAdagio;
    private static listInstantaneousTempoAdagietto;
    private static listInstantaneousTempoAndanteModerato;
    private static listInstantaneousTempoAndante;
    private static listInstantaneousTempoAndantino;
    private static listInstantaneousTempoModerato;
    private static listInstantaneousTempoAllegretto;
    private static listInstantaneousTempoAllegroModerato;
    private static listInstantaneousTempoAllegro;
    private static listInstantaneousTempoVivace;
    private static listInstantaneousTempoVivacissimo;
    private static listInstantaneousTempoAllegrissimo;
    private static listInstantaneousTempoPresto;
    private static listInstantaneousTempoPrestissimo;
    private static listInstantaneousTempoChangesGeneral;
    private static listInstantaneousTempoAddons;
    private tempoEnum;
    private tempoInBpm;
    static getDefaultValueForTempoType(tempoEnum: TempoEnum): number;
    static isInputStringInstantaneousTempo(inputString: string): boolean;
    get Label(): string;
    set Label(value: string);
    get Placement(): PlacementEnum;
    set Placement(value: PlacementEnum);
    get StaffNumber(): number;
    set StaffNumber(value: number);
    get Enum(): TempoEnum;
    get TempoInBpm(): number;
    set TempoInBpm(value: number);
    get ParentMultiTempoExpression(): MultiTempoExpression;
    getAbsoluteTimestamp(): Fraction;
    getAbsoluteFloatTimestamp(): number;
    private setTempoAndTempoType;
}
export declare enum TempoEnum {
    none = 0,
    larghissimo = 1,
    grave = 2,
    lento = 3,
    largo = 4,
    larghetto = 5,
    adagio = 6,
    adagietto = 7,
    andanteModerato = 8,
    andante = 9,
    andantino = 10,
    moderato = 11,
    allegretto = 12,
    allegroModerato = 13,
    allegro = 14,
    vivace = 15,
    vivacissimo = 16,
    allegrissimo = 17,
    presto = 18,
    prestissimo = 19,
    lastRealTempo = 20,
    addon = 21,
    changes = 22,
    metronomeMark = 23
}
