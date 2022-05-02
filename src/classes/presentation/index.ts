import { useStore } from "@/store";
import { ApiContributor, ILyrics, ISong } from "songtreasures-api";
import { Lyrics } from "@/classes";
import Song from "../song";
import Contributor from "../contributor";

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

export class PresentationControl {
    protected initialized = false;
    public get Initialized() {
        return this.initialized;
    }
    protected store = useStore();

    public get Song() {
        return this.song ? new Song(this.song) : null;
    }

    private _song?: ISong;
    protected set song(v) {
        this._song = v;
        this.executeCallback("song");
    }

    protected get song() {
        if (!this._song)
            this._song = this.getKey("song");
        return this._song;
    }

    public get Contributors() {
        return this._contributors?.map(i => new Contributor(i)) ?? null;
    }
    private _contributors?: ApiContributor[];
    protected set contributors(v) {
        this._contributors = v;
        this.executeCallback("contributors");
    }
    protected get contributors() {
        if (!this._contributors)
            this._contributors = this.getKey("contributors");
        return this._contributors;
    }

    private _lyrics?: ILyrics;

    protected set lyrics(v) {
        this._lyrics = v;
        this.executeCallback("lyrics");
    }

    protected get lyrics() {
        if (!this._lyrics)
            this._lyrics = this.getKey("lyrics");
        return this._lyrics;
    }

    public commit() {
        if (this.song)
            this.setKey("song", this.song);
        if (this.contributors)
            this.setKey("contributors", this.contributors);
        if (this.lyrics)
            this.setKey("lyrics", this.lyrics);
        if (this.settings)
            this.setKey("settings", this.settings);
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
        this.executeCallback("settings");
    }

    public get Settings() {
        return this.settings;
    }
    
    protected callbacks: {
        [key: string]: (() => void)[];
    } = {};

    public registerCallback(key: Key | "control" | "preview", callback: () => void) {
        this.callbacks[key] ??= [];
        this.callbacks[key].push(callback);
    }

    private executeCallback(key: Key | "preview") {
        this.callbacks[key]?.forEach((callback) => callback());
    }

    private type: "control" | "viewer" | "not-initialized" = "not-initialized";

    public initialize(type: "control" | "viewer") {
        this.type = type;

        if(!this.initialized) {
            addEventListener("storage", (e: StorageEvent) => {
                if (this.type == "not-initialized")
                    throw new Error("PresentationView - Not initialized");

                if (!e.key?.startsWith("viewer_")) 
                    return;
                
                const key = e.key.replace("viewer_", "");
                
                const item = localStorage.getItem(e.key);
                if (!item) 
                    return;

                if (key.endsWith("contributors"))
                    this.contributors = JSON.parse(item);
                if (key.endsWith("lyrics"))
                    this.lyrics = JSON.parse(item);
                if (key.endsWith("song"))
                    this.song = JSON.parse(item);
                if (key.endsWith("settings"))
                    this.settings = JSON.parse(item);
            });
            
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

            this.commit();
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
        }
    }

    public lastPage(): void {
        if (this.settings) {
            const settings = Object.assign({}, this.settings);
            settings.currentIndex = this.AvailableVerses.length - (this.settings.singleVerse ? 1 : this.settings.size);
            settings.muted = true;
            this.settings = settings;
            this.commit();
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
    public setSong(song: Song) {
        this.song = song.raw;
    }
    public setContributors(contributors: Contributor[]|ApiContributor[]) {
        this.contributors = contributors.map(i => i instanceof Contributor ? i.raw : i);
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
        if (lyricsSize > 4) {
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

    public get Verses() {
        return Object.entries(this.Lyrics?.verses ?? {})
            .filter(i => this.currentVerses.includes(i[0]))
            .map(i => i[1]);
    }
}

export const presentation = new PresentationControl();
