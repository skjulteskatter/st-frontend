import { VoiceEntry } from "../../VoiceData/VoiceEntry";
import { IXmlElement } from "../../../Common/FileIO/Xml";
import { MusicSheet } from "../../MusicSheet";
export declare class LyricsReader {
    private openLyricWords;
    private currentLyricWord;
    private musicSheet;
    constructor(musicSheet: MusicSheet);
    /**
     * This method adds a single LyricEntry to a VoiceEntry
     * @param {IXmlElement[]} lyricNodeList
     * @param {VoiceEntry} currentVoiceEntry
     */
    addLyricEntry(lyricNodeList: IXmlElement[], currentVoiceEntry: VoiceEntry): void;
}
