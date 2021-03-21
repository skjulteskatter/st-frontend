import { MusicSheet } from "../../MusicSheet";
import { IXmlElement } from "../../../Common/FileIO/Xml";
import { Note } from "../../VoiceData/Note";
export declare class SlurReader {
    private musicSheet;
    private openSlurDict;
    constructor(musicSheet: MusicSheet);
    addSlur(slurNodes: IXmlElement[], currentNote: Note): void;
}
