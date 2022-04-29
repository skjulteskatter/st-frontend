import { Lyrics } from "@/classes";
import { PresentationBase, Settings } from "./base";

export class PresentationControl extends PresentationBase {
    public init() {
        if (!this.initialized) {
            addEventListener("keydown", (e) => {
                if (e.key == "ArrowRight") {
                    this.next();
                    return;
                }
                if (e.key == "ArrowLeft") {
                    this.previous();
                    return;
                }

                if (e.ctrlKey && e.key === "o") {
                    this.open();
                    return;
                }
                if (e.ctrlKey && e.key === "m") {
                    this.mute();
                    return;
                }

                if (e.key === "Home") {
                    this.firstPage();
                    e.preventDefault();
                    return;
                }

                if (e.key === "End") {
                    this.lastPage();
                    e.preventDefault();
                    return;
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
            size: PresentationControl.getSize(lyrics.size),
            availableVerses: Object.keys(lyrics.verses).reduce((a, b) => { a[b] = true; return a; }, {} as {
                [key: string]: boolean;
            }),
            currentIndex: 0,
            muted: false,
            theme: this.settings?.theme ?? "dark",
            showSideBar: this.settings?.showSideBar ?? true,
            singleVerse: this.settings?.singleVerse ?? false,
        };
    }

    private static getSize(lyricsSize: number) {
        if (lyricsSize > 6) {
            return 1;
        }
        if (lyricsSize > 3) {
            return 2;
        }
        return 3;
    }

    public resetSettings(lyrics: Lyrics) {
        this.settings = {
            size: PresentationControl.getSize(lyrics.size),
            availableVerses: Object.keys(lyrics.verses).reduce((a, b) => { a[b] = true; return a; }, {} as {
                [key: string]: boolean;
            }),
            currentIndex: 0,
            muted: false,
            theme: this.settings?.theme ?? "dark",
            showSideBar: this.settings?.showSideBar ?? true,
            singleVerse: this.settings?.singleVerse ?? false,
        };
    }

    public open(): void {
        this.commit();
        window.open("/presentation", "SongTreasures - Presentation View", "resizeable,scrollbars");
    }
}

export const control = new PresentationControl();
