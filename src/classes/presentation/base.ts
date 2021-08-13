import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { ApiContributor, ApiLyrics, ApiSong } from "dmb-api";
import { Lyrics } from "../lyrics";

const keys = ["viewer_song", "viewer_lyrics"];

type Settings = {
    size: number;
    currentVerses: string[];
}

type KeyTypes = {
    song: ApiSong;
    lyrics: ApiLyrics;
    contributors: ApiContributor[];
    verses: Verse[];
    verse: number;
}

type Key = "song" | "lyrics" | "contributors" | "verses" | "verse";

type KeyEntry<K extends Key> = KeyTypes[K];

export class PresentationBase {
    protected store = useStore();

    public get Song() {
        return appSession.songs.find(i => i.id == this.Lyrics?.songId);
    }

    private _lyrics?: ApiLyrics;

    // Set lyrics in cache and storage.
    protected set lyrics(v) {
        if (this.type == "control") {
            if (v)
                this.setKey("lyrics", v);
            else
                this.removeKey("lyrics");
        }

        this._lyrics = v;
    }

    // Get lyrics from cache or storage.
    protected get lyrics() {
        if (!this._lyrics)
            this._lyrics = this.getKey("lyrics");
        return this._lyrics;
    }

    public get Lyrics() {
        return this.lyrics ? new Lyrics(this.lyrics) : null;
    }

    protected verses?: string[];
    protected verse = 0;

    protected initialized = false;

    protected settings: {
        size: number;
        verses: number[];
    } = {
        size: 1,
        verses: [],
    };

    private type: "control" | "viewer" | "not-initialized" = "not-initialized";

    protected initialize(type: "control" | "viewer") {
        this.type = type;

        if(!this.initialized) {
            addEventListener("storage", (e: StorageEvent) => {
                if (this.type == "not-initialized")
                    throw new Error("PresentationView - Not initialized");

                if (!e.key || !keys.includes(e.key)) 
                    return;
                
                const item = localStorage.getItem(e.key);
                if (!item) 
                    return;

                if (this.type == "control") {
                    // CONTROL events
                }

                if (this.type == "viewer") {
                    // VIEWER events
                    // if (e.key.endsWith("song")) {
                    //     this.song = JSON.parse(item);
                    // }

                    // if (e.key.endsWith("contributors")) {
                    //     this.contributors = JSON.parse(item);
                    // }

                    if (e.key.endsWith("lyrics")) {
                        this.lyrics = JSON.parse(item);
                    }
                }
            });
        }
        
        this.initialized = true;
    }

    protected setKey<K extends Key>(key: K, item: KeyEntry<K>) {
        localStorage.setItem("viewer_" + key, JSON.stringify(item));
    }
    protected removeKey<K extends Key>(key: K) {
        localStorage.removeItem("viewer_" + key);
    }
    protected getKey<K extends Key>(key: K) {
        const i = localStorage.getItem("viewer_" + key);
        return i ? JSON.parse(i) as KeyEntry<K> : undefined;
    }

    protected next() {
        if (this.type == "control") {
            if (this.verse < (this.Song?.verses ?? 0))
                this.verse++;

            this.updateVerse();
        } else if (this.type == "viewer") {
            this.setKey("verse", this.verse + 1);
        }
    }

    protected previous() {
        if (this.type == "control") {
            if (this.verse > 0)
                this.verse++;
            
            this.updateVerse();
        } else if (this.type == "viewer") {
            this.setKey("verse", this.verse - 1);
        }
    }

    protected updateVerse() {
        if (this.type != "control")
            throw new Error("Only Control can use this.");
        
        // const verses = this.lyrics ? Object.values(this.lyrics.verses) : [];

        // const firstVerse = this.verse * this.settings.size;
        // const lastVerse = this.settings.size != 1 ? this.verse * this.settings.size + this.settings.size : null;

        // const result = lastVerse ? [verses[firstVerse], verses[lastVerse]] : [verses[firstVerse]];

        // this.setKey("verses", result);
        // this.setKey("verse", this.verse);
    }
}
