import { LyricWord } from "../VoiceData/Lyrics/LyricsWord";
import { GraphicalLyricEntry } from "./GraphicalLyricEntry";
/**
 * The graphical counterpart of a [[LyricWord]]
 */
export declare class GraphicalLyricWord {
    private lyricWord;
    private graphicalLyricsEntries;
    constructor(lyricWord: LyricWord);
    get GetLyricWord(): LyricWord;
    get GraphicalLyricsEntries(): GraphicalLyricEntry[];
    set GraphicalLyricsEntries(value: GraphicalLyricEntry[]);
    isFilled(): boolean;
    private initialize;
}
