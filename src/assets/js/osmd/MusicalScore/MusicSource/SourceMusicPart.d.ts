import { PartListEntry } from "./PartListEntry";
import { Repetition } from "./Repetition";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { MusicSheet } from "../MusicSheet";
export declare class SourceMusicPart extends PartListEntry {
    constructor(musicSheet: MusicSheet, startIndex?: number, endIndex?: number);
    protected parentRepetition: Repetition;
    get MeasuresCount(): number;
    get StartIndex(): number;
    get EndIndex(): number;
    get ParentRepetition(): Repetition;
    set ParentRepetition(value: Repetition);
    get AbsoluteTimestamp(): Fraction;
    setStartIndex(startIndex: number): void;
    setEndIndex(index: number): void;
}
