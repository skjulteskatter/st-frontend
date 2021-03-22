import { VoiceEntry } from "../VoiceData";
import { Fraction } from "../../Common/DataObjects";
import { PlaybackNote } from "./PlaybackNote";
export declare class PlaybackEntry {
    private parentVoiceEntry;
    private notes;
    constructor(parentVoiceEntry: VoiceEntry);
    get ParentVoiceEntry(): VoiceEntry;
    /** The relative timestamp shift compared to the parent voice entry (graphical) timestamp */
    TimestampShift: Fraction;
    get Notes(): PlaybackNote[];
    get Length(): Fraction;
    set Length(value: Fraction);
    get HasNotes(): boolean;
}
