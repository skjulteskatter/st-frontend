import { LyricsEntry } from "../VoiceData/Lyrics/LyricsEntry";
import { GraphicalLyricWord } from "./GraphicalLyricWord";
import { GraphicalLabel } from "./GraphicalLabel";
import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
/**
 * The graphical counterpart of a [[LyricsEntry]]
 */
export declare class GraphicalLyricEntry {
    private lyricsEntry;
    private graphicalLyricWord;
    private graphicalLabel;
    private graphicalStaffEntry;
    constructor(lyricsEntry: LyricsEntry, graphicalStaffEntry: GraphicalStaffEntry, lyricsHeight: number, staffHeight: number);
    get LyricsEntry(): LyricsEntry;
    get ParentLyricWord(): GraphicalLyricWord;
    set ParentLyricWord(value: GraphicalLyricWord);
    get GraphicalLabel(): GraphicalLabel;
    set GraphicalLabel(value: GraphicalLabel);
    get StaffEntryParent(): GraphicalStaffEntry;
    set StaffEntryParent(value: GraphicalStaffEntry);
}
