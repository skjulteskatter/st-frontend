import { VoiceEntry } from "./VoiceEntry";
import { SourceStaffEntry } from "./SourceStaffEntry";
/**
 * Used for linked voices.
 */
export declare class StaffEntryLink {
    constructor(voiceEntry: VoiceEntry);
    private voiceEntry;
    private linkStaffEntries;
    get GetVoiceEntry(): VoiceEntry;
    get LinkStaffEntries(): SourceStaffEntry[];
    set LinkStaffEntries(value: SourceStaffEntry[]);
}
