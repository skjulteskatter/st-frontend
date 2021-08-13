import { appSession } from "@/services/session";
import { Lyrics } from "../lyrics";
import { PresentationBase, Settings } from "./base";

class PresentationControl extends PresentationBase {
    public init() {
        this.initialize("control");
    }

    public setLyrics(lyrics: Lyrics, settings: Settings) {
        this.lyrics = lyrics.raw;
        this.settings = settings;
    }

    public next() {
        if (this.settings) {
            this.settings.currentIndex = this.settings.currentIndex + this.settings.size;
        }
    }
}

export const control = new PresentationControl();
