import { appSession } from "@/services/session";
import { Lyrics } from "../lyrics";
import { PresentationBase } from "./base";

class PresentationControl extends PresentationBase {
    public init() {
        this.initialize("control");
    }

    public setLyrics(lyrics: Lyrics) {
        this.lyrics = lyrics.raw;
        // this.song = (appSession.songs.find(i => i.id == lyrics.songId))?.raw;
        // this.contributors = (appSession.contributors.filter(i => this.song?.participants.some(p => p.contributorId == i.id))).map(i => i.item);
        this.verse = 0;
        this.verses = undefined;
        this.settings = {
            size: 1,
            verses: [],
        };

    }
}

export const control = new PresentationControl();
