import { Voice } from "../VoiceData";
import { Fraction } from "../../Common/DataObjects";
import { PlaybackEntry } from "./PlaybackEntry";
export declare class VoicePlaybackData {
    private parentVoice;
    private readonly playbackEntries;
    private readonly dueEntries;
    private nextEntryTimestamp;
    /**
     * Holds the list of all (enrolled) playback entries for a certain voice within a part in the musicsheet.
     * The list is sorted by the enrolled timestamp and a playback entry can be in the list more than once (due to repetitions)
     */
    constructor(voice: Voice, playbackEntries: {
        enrolledTimestamp: Fraction;
        playbackEntry: PlaybackEntry;
    }[]);
    get ParentVoice(): Voice;
    get PlaybackEntries(): {
        enrolledTimestamp: Fraction;
        playbackEntry: PlaybackEntry;
    }[];
    /** the index of the current entry to play */
    playbackIndex: number;
    /** holds all playback entries that shall or should have been played */
    get DueEntries(): {
        enrolledTimestamp: Fraction;
        playbackEntry: PlaybackEntry;
    }[];
    /** the timestamp of the next entry which needs to be awaiten */
    get NextEntryTimestamp(): Fraction;
    isAudible(): boolean;
    reset(absoluteTimestamp: Fraction): Fraction;
    update(enrolledTimestamp: Fraction): Fraction;
}
