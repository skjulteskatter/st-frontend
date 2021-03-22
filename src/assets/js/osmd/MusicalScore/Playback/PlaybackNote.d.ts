import { Note } from "../VoiceData";
import { PlaybackEntry } from "./PlaybackEntry";
import { Fraction } from "../../Common/DataObjects";
export declare class PlaybackNote {
    private parentEntry;
    private parentNote;
    constructor(playbackEntry: PlaybackEntry, parentNote: Note);
    /** needs to be done later, when also ties are known */
    setLength(): void;
    get ParentEntry(): PlaybackEntry;
    get ParentNote(): Note;
    MidiKey: number;
    Length: Fraction;
    private static noteToMidiDrumKey;
}
