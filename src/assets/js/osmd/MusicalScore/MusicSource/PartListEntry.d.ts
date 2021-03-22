import { MusicSheet } from "../MusicSheet";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
export declare abstract class PartListEntry {
    constructor(musicSheet: MusicSheet);
    absoluteTimestamp: Fraction;
    startIndex: number;
    endIndex: number;
    protected enrolledTimestamps: Fraction[];
    protected visible: boolean;
    protected musicSheet: MusicSheet;
    get Visible(): boolean;
    set Visible(value: boolean);
    getFirstSourceMeasure(): SourceMeasure;
    getLastSourceMeasure(): SourceMeasure;
}
