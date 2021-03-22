import { LyricWord } from "./LyricsWord";
import { VoiceEntry } from "../VoiceEntry";
export declare class LyricsEntry {
    constructor(text: string, verseNumber: number, word: LyricWord, parent: VoiceEntry, syllableNumber?: number);
    private text;
    private word;
    private parent;
    private verseNumber;
    private syllableIndex;
    extend: boolean;
    get Text(): string;
    set Text(value: string);
    get Word(): LyricWord;
    get Parent(): VoiceEntry;
    set Parent(value: VoiceEntry);
    get VerseNumber(): number;
    get SyllableIndex(): number;
}
