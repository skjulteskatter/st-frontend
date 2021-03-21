import { SourceMusicPart } from "./SourceMusicPart";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { Repetition } from "./Repetition";
import { PartListEntry } from "./PartListEntry";
export declare class MappingSourceMusicPart {
    constructor(sourceMusicPart: SourceMusicPart, startTimestamp: Fraction, parentPartListEntry?: Repetition, repetitionRun?: number, isEnding?: boolean);
    private sourceMusicPart;
    private parentRepetition;
    private parentPartListEntry;
    private startTimestamp;
    private repetitionRun;
    private isEnding;
    get IsRepetition(): boolean;
    get IsEnding(): boolean;
    get IsLastRepetitionRun(): boolean;
    get RepetitionRun(): number;
    get ParentPartListEntry(): PartListEntry;
    get SourceMusicPart(): SourceMusicPart;
    get StartTimestamp(): Fraction;
    CompareTo(comp: MappingSourceMusicPart): number;
}
