import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { ApiContributor, ILyrics, ISong } from "songtreasures-api";
import { Lyrics } from "@/classes";

export type Settings = {
    size: number;
    availableVerses: {
        [key: string]: boolean;
    };
    currentIndex: number;
    muted: boolean;
    theme: "dark" | "light";
    showSideBar: boolean;
    singleVerse: boolean;
}

type KeyTypes = {
    song: ISong;
    lyrics: ILyrics;
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

    private _lyrics?: ILyrics;

    // Set lyrics in cache and storage.
    protected set lyrics(v) {
        this.executeCallback("lyrics");
        this._lyrics = v;
    }

    // Get lyrics from cache or storage.
    protected get lyrics() {
        if (!this._lyrics)
            this._lyrics = this.getKey("lyrics");
        return this._lyrics;
    }

    public commit() {
        if (this.type === "control") {
            if (this.lyrics)
                this.setKey("lyrics", this.lyrics);
            if (this.settings)
                this.setKey("settings", this.settings);
        }
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
        if (!v)
            this.removeKey("settings");
        this._settings = v;
    }

    public get Settings() {
        return this.settings;
    }
    
    protected callbacks: {
        [key: string]: () => void;
    } = {};

    public registerCallback(key: Key | "control" | "preview", callback: () => void) {
        this.callbacks[key] = callback;
    }

    private executeCallback(key: Key | "control" | "preview") {
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

    public preview() {
        this.executeCallback("preview");
    }

    public toggleVerse(index: string) {
        const settings = this.settings;
        if (settings) {
            settings.availableVerses[index] = !settings.availableVerses[index];
            const verse = this.Lyrics?.verses[index];
            if (verse?.type === "verse") {
                const nextIndex = (parseInt(index) + 1).toString();
                const nextVerse = this.Lyrics?.verses[nextIndex];
                if (nextVerse?.type === "chorus") {
                    settings.availableVerses[nextIndex] = false;
                }
            }

            this.settings = settings;
        }
    }

    public toggleAll() {
        const settings = Object.assign({}, this.settings);
        if (this.AvailableVerses.length) {
            settings.availableVerses = {};
        } else {
            settings.availableVerses = Object.keys(this.Lyrics?.verses ?? {}).reduce((a, b) => { a[b] = true; return a; }, {} as {
                [key: string]: boolean;
            });
        }
        this.settings = settings;
    }

    public get AvailableVerses() {
        return Object.entries(this.settings?.availableVerses ?? {}).filter(i => i[1] === true).map(i => i[0]);
    }

    public get currentVerses() {
        const verses: string[] = [];
        if (this.Settings) {
            const index = this.Settings.currentIndex;
            const size = this.Settings.singleVerse ? 1 : this.Settings.size;

            for (let i = 0; i < size; i++) {
                const verse = this.AvailableVerses[index + i];
                if (verse) {
                    verses.push(verse);
                }
            }
        }
        return verses;
    }

    public next() {
        if (this.settings) {
            const size = this.settings.singleVerse ? 1 : this.settings.size;
            const index = this.settings.currentIndex + size;
            if (index < this.AvailableVerses.length) {
                const settings = Object.assign({}, this.settings);
                settings.currentIndex = settings.currentIndex + size;
                this.settings = settings;
                this.executeCallback("control");
                this.commit();
            }
            else if (index >= this.AvailableVerses.length && !this.settings.muted) {
                this.mute();
            }
        }
    }

    public previous() {
        if (this.settings) {
            const index = this.settings.currentIndex - (this.settings.singleVerse ? 1 : this.settings.size);
            if (index >= 0) {
                if (this.settings.muted) {
                    return this.mute();
                }
                const settings = Object.assign({}, this.settings);
                settings.currentIndex = index;
                this.settings = settings;
                this.commit();
                this.executeCallback("control");
            }
        }
    }

    public firstPage(): void {
        if (this.settings) {
            const settings = Object.assign({}, this.settings);
            settings.currentIndex = 0;
            settings.muted = false;
            this.settings = settings;
            this.commit();
            this.executeCallback("control");
        }
    }

    public lastPage(): void {
        if (this.settings) {
            const settings = Object.assign({}, this.settings);
            settings.currentIndex = this.AvailableVerses.length - (this.settings.singleVerse ? 1 : this.settings.size);
            settings.muted = true;
            this.settings = settings;
            this.commit();
            this.executeCallback("control");
        }
    }

    public toggleSidebar() {
        const settings = Object.assign({}, this.settings);
        settings.showSideBar = !settings.showSideBar;
        this.settings = settings;
        this.commit();
    }

    public toggleSingleVerse() {
        const settings = Object.assign({}, this.settings);
        settings.singleVerse = !settings.singleVerse;
        this.settings = settings;
        this.commit();
    }

    public setTheme(theme: "dark" | "light") {
        if (this.settings) {
            this.settings.theme = theme;
            this.commit();
        }
    }

    public mute() {
        const settings = Object.assign({}, this.settings);
        settings.muted = !settings.muted;
        this.settings = settings;
        this.commit();
    }
}
