import { Fraction } from "../../Common/DataObjects/Fraction";
import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
export declare class VerticalGraphicalStaffEntryContainer {
    constructor(numberOfEntries: number, absoluteTimestamp: Fraction);
    private index;
    private absoluteTimestamp;
    private staffEntries;
    get Index(): number;
    set Index(value: number);
    get AbsoluteTimestamp(): Fraction;
    get StaffEntries(): GraphicalStaffEntry[];
    set StaffEntries(value: GraphicalStaffEntry[]);
    static compareByTimestamp(x: VerticalGraphicalStaffEntryContainer, y: VerticalGraphicalStaffEntryContainer): number;
    /**
     * Return the first non-null [[GraphicalStaffEntry]].
     * @returns {any}
     */
    getFirstNonNullStaffEntry(): GraphicalStaffEntry;
}
