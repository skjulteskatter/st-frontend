import { StaffEntryLink } from "../VoiceData/StaffEntryLink";
import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
import { GraphicalNote } from "./GraphicalNote";
/**
 * The graphical counterpart of a [[StaffEntryLink]].
 * Used for linked voices.
 */
export declare class GraphicalStaffEntryLink {
    private staffEntryLink;
    private graphicalLinkedStaffEntries;
    constructor(staffEntryLink: StaffEntryLink);
    get GetStaffEntryLink(): StaffEntryLink;
    get GraphicalLinkedStaffEntries(): GraphicalStaffEntry[];
    set GraphicalLinkedStaffEntries(value: GraphicalStaffEntry[]);
    isFilled(): boolean;
    /**
     * Return all the [[GraphicalNote]]s that correspond to the [[LinkedVoiceEntry]] (the one saved in [[StaffEntryLink]]).
     * @param graphicalStaffEntry
     * @returns {any}
     */
    getLinkedStaffEntriesGraphicalNotes(graphicalStaffEntry: GraphicalStaffEntry): GraphicalNote[];
    private initialize;
}
