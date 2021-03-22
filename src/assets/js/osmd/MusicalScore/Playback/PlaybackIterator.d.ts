import { MusicSheet } from "../MusicSheet";
import { Fraction } from "../../Common/DataObjects";
import { PlaybackEntry } from "./PlaybackEntry";
export declare class PlaybackIterator {
    private musicSheet;
    private voiceCursors;
    private nextEntryTimestamp;
    private dueEntries;
    constructor(musicSheet: MusicSheet);
    get NextEntryTimestamp(): Fraction;
    get DueEntries(): {
        enrolledTimestamp: Fraction;
        playbackEntry: PlaybackEntry;
    }[];
    Update(enrolledTimestamp: Fraction): {
        enrolledTimestamp: Fraction;
        playbackEntry: PlaybackEntry;
    }[];
    Reset(): Fraction;
}
