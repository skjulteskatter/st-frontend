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
            const index = this.settings.currentIndex + this.settings.size;
            if (index <= this.settings.availableVerses.length) {
                this.settings = {
                    availableVerses: this.settings.availableVerses,
                    size: this.settings.size,
                    currentIndex: this.settings.currentIndex + this.settings.size,
                };
            }
        }
    }

    public previous() {
        if (this.settings) {
            const index = this.settings.currentIndex - this.settings.size;
            if (index >= 0) {
                this.settings = {
                    availableVerses: this.settings.availableVerses,
                    size: this.settings.size,
                    currentIndex: index,
                };
            }
        }
    }
}

export const control = new PresentationControl();
