import { Lyrics } from "../lyrics";
import { PresentationBase, Settings } from "./base";

class PresentationControl extends PresentationBase {
    public init() {
        if (!this.initialized) {
            addEventListener("keydown", (e) => {
                if (e.key == "ArrowRight") {
                    this.next();
                }
                if (e.key == "ArrowLeft") {
                    this.previous();
                }
            });
        }

        this.initialize("control");
    }

    public setLyrics(lyrics: Lyrics, settings: Settings) {
        this.lyrics = lyrics.raw;
        this.settings = settings;
    }
}

export const control = new PresentationControl();
