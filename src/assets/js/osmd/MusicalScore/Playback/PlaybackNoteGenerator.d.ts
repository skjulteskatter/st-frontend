import { IAfterSheetReadingModule } from "../Interfaces";
import { MusicSheet } from "../MusicSheet";
export declare class PlaybackNoteGenerator implements IAfterSheetReadingModule {
    calculate(musicSheet: MusicSheet): void;
    private handleVoiceEntry;
    private static addEntrySorted;
}
