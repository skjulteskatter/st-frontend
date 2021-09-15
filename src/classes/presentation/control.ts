import { Lyrics } from "../lyrics";
import { PresentationBase, Settings } from "./base";

export class PresentationControl extends PresentationBase {
    private threshold = 6;

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

    public get Initialized() {
        return this.initialized;
    }

    public setLyrics(lyrics: Lyrics, settings?: Settings) {
        this.lyrics = lyrics.raw;
        this.settings = settings ?? {
            size: lyrics.size <= this.threshold ? 2 : 1,
            availableVerses: Object.keys(lyrics.verses).reduce((a, b) => { a[b] = true; return a; }, {} as {
                [key: string]: boolean;
            }),
            currentIndex: 0,
            muted: false,
            theme: this.settings?.theme ?? "dark",
        };
    }

    public resetSettings(lyrics: Lyrics) {
        this.settings = {
            size: lyrics.size <= this.threshold ? 2 : 1,
            availableVerses: Object.keys(lyrics.verses).reduce((a, b) => { a[b] = true; return a; }, {} as {
                [key: string]: boolean;
            }),
            currentIndex: 0,
            muted: false,
            theme: this.settings?.theme ?? "dark",
        };
    }
}

export const control = new PresentationControl();
