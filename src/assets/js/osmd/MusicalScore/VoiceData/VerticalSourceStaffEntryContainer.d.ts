import { SourceMeasure } from "./SourceMeasure";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { SourceStaffEntry } from "./SourceStaffEntry";
/**
 * A [[VerticalSourceStaffEntryContainer]] contains the [[StaffEntry]]s at one timestamp through all the [[StaffLine]]s.
 */
export declare class VerticalSourceStaffEntryContainer {
    constructor(parentMeasure: SourceMeasure, timestamp: Fraction, size: number);
    private timestamp;
    private staffEntries;
    private comments;
    private parentMeasure;
    $get$(index: number): SourceStaffEntry;
    $set$(index: number, value: SourceStaffEntry): void;
    get Timestamp(): Fraction;
    set Timestamp(value: Fraction);
    get StaffEntries(): SourceStaffEntry[];
    set StaffEntries(value: SourceStaffEntry[]);
    get Comments(): Comment[];
    set Comments(value: Comment[]);
    get ParentMeasure(): SourceMeasure;
    set ParentMeasure(value: SourceMeasure);
    getAbsoluteTimestamp(): Fraction;
}
