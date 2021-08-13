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
            const index = this.settings.availableVerses.indexOf(this.settings.currentVerses[0]);
            const size = this.settings.size;
            const verses: string[] = [];
            const verse = this.settings.availableVerses[index + size];
            if (verse) {
                verses.push(verse);

                if (size > 1) {
                    const nextVerse = this.settings.availableVerses[index + size + 1];

                    if (nextVerse) {
                        verses.push(nextVerse);
                    }
                }
            }

            this.settings.currentVerses = verses;
        }
    }
}

export const control = new PresentationControl();
