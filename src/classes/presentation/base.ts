import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { ApiContributor, ApiLyrics, ApiSong } from "dmb-api";
import { Lyrics } from "../lyrics";

export type Settings = {
    size: number;
    availableVerses: string[];
    currentIndex: number;
}

type KeyTypes = {
    song: ApiSong;
    lyrics: ApiLyrics;
    contributors: ApiContributor[];
    settings: Settings;
}

type Key = "song" | "lyrics" | "contributors" | "settings";

type KeyEntry<K extends Key> = KeyTypes[K];

export class PresentationBase {
    protected initialized = false;
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

    private _settings?: Settings;

    protected get settings() {
        if (!this._settings)
            this._settings = this.getKey("settings");
        
        return this._settings;
    }

    protected set settings(v) {
        if (v) {
            if (this.type == "control") {
                this.setKey("settings", v);
            }
        } else {
            this.removeKey("settings");
        }

        this._settings = v;
    }

    public get Settings() {
        return this.settings;
    }
    
    protected callbacks: {
        [key: string]: Function;
    } = {};

    public registerCallback(key: Key, callback: Function) {
        this.callbacks[key] = callback;
    }

    private executeCallback(key: Key) {
        this.callbacks[key]?.();
    }

    private type: "control" | "viewer" | "not-initialized" = "not-initialized";

    protected initialize(type: "control" | "viewer") {
        this.type = type;

        if(!this.initialized) {
            if (type == "control") {
                this.removeKey("settings");
                this.removeKey("song");
                this.removeKey("lyrics");
            }

            addEventListener("storage", (e: StorageEvent) => {
                if (this.type == "not-initialized")
                    throw new Error("PresentationView - Not initialized");

                if (!e.key?.startsWith("viewer_")) 
                    return;
                
                const key = e.key.replace("viewer_", "");
                
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

                    if (key.endsWith("lyrics")) {
                        this.lyrics = JSON.parse(item);
                        this.executeCallback("lyrics");
                    }
                    if (key.endsWith("settings")) {
                        this.settings = JSON.parse(item);
                        this.executeCallback("settings");
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
