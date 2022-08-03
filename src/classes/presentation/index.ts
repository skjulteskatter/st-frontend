/* eslint-disable no-console */
import { useStore } from "@/store";
import { ApiContributor, ILyrics, ISong } from "songtreasures-api";
import { Lyrics } from "@/classes";
import Song from "../song";
import Contributor from "../contributor";
import EventListener, { PresentationDocument, VContributor, VLyrics } from "@/services/eventListener";
import { appSession } from "@/services/session";
import { getVerses, LyricsVerse } from "../lyrics";

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
    sync: boolean;
}

type KeyTypes = {
    song: ISong;
    lyrics: VLyrics;
    contributors: VContributor[];
    settings: Settings;
}

type Key = "song" | "lyrics" | "contributors" | "settings";

type KeyEntry<K extends Key> = KeyTypes[K];

export class PresentationControl {
    protected initialized = false;
    public get Initialized() {
        return this.initialized;
    }

    public eventListener: EventListener | null = null;

    protected store = useStore();

    public get Song() {
        return this.song ? new Song(this.song) : null;
    }

    public get rawSong() {
        return this.song;
    }

    private _song?: ISong;
    protected set song(v) {
        this._song = v;
        this.executeCallback("song");
    }

    protected get song() {
        return this._song;
    }

    public get Contributors() {
        return this._contributors ?? null;
    }
    private _contributors?: VContributor[];
    protected set contributors(v) {
        this._contributors = v;
        this.executeCallback("contributors");
    }
    protected get contributors() {
        return this._contributors;
    }
    public get rawContributors() {
        return this._contributors;
    }

    private _lyrics?: VLyrics;

    protected set lyrics(v) {
        this._lyrics = v;
        this.verses = v?.verses ?? {};
        this.executeCallback("lyrics");
    }

    protected get lyrics() {
        return this._lyrics;
    }

    public get rawLyrics() {
        return this.lyrics;
    }
    private verses: {
        [key: string]: LyricsVerse;
    } = {};

    public commit() {
        if (this.eventListener) {
            this.eventListener.commit();
        }
    }

    private _settings?: Settings;

    protected get settings() {
        return this._settings as Settings;
    }

    protected set settings(v) {
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
        console.log("EXECUTING CALLBACKS FOR " + key);
        this.callbacks[key]?.forEach((callback) => callback());
    }

    private type: "control" | "viewer" | "not-initialized" = "not-initialized";

    private mapState(doc: PresentationDocument) {
        if (doc.song.id !== this.song?.id) {
            this.song = doc.song;
        }
        if (doc.lyrics.id !== this.lyrics?.id) {
            this.lyrics = doc.lyrics;
        }
        if (doc.contributors.some(c => !this.contributors?.some(i => i.id === c.id))) {
            this.contributors = doc.contributors;
        }
        if (doc.settings) {
            this.settings = doc.settings;
        }
    }

    public async initialize(type: "control" | "viewer") {
        this.type = type;
        this.eventListener = new EventListener(this, appSession.user.id);
        this.eventListener.initListener();

        if(!this.initialized) {
            const state = await this.eventListener.getState()
            if (type === "viewer") {
                this.mapState(state);
            }
            this.eventListener.registerHook(doc => {
                this.mapState(doc);
            });
            if (this.settings) {
                this.settings.sync = state.settings.sync
            }

            // addEventListener("storage", (e: StorageEvent) => {
            //     if (this.type == "not-initialized")
            //         throw new Error("PresentationView - Not initialized");

            //     if (!e.key?.startsWith("viewer_")) 
            //         return;
                
            //     const key = e.key.replace("viewer_", "");
                
            //     const item = localStorage.getItem(e.key);
            //     if (!item) 
            //         return;

            //     if (key.endsWith("contributors"))
            //         this.contributors = JSON.parse(item);
            //     if (key.endsWith("lyrics"))
            //         this.lyrics = JSON.parse(item);
            //     if (key.endsWith("song"))
            //         this.song = JSON.parse(item);
            //     if (key.endsWith("settings"))
            //         this.settings = JSON.parse(item);
            // });
            
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
                if (e.ctrlKey && e.key === "p") {
                    this.commit();
                    e.preventDefault();
                    return;
                }
                if (e.ctrlKey && e.key === "Enter") {
                    this.commit(),
                    e.preventDefault();
                    return;
                }
            });

            this.commit();
        }
        
        this.initialized = true;
    }

    public preview() {
        this.executeCallback("preview");
    }

    public toggleVerse(index: string) {
        const settings = this.settings;
        if (settings) {
            settings.availableVerses[index] = !settings.availableVerses[index];
            const verse = this.verses[index];
            if (verse?.type === "verse") {
                const nextIndex = (parseInt(index) + 1).toString();
                const nextVerse = this.verses[nextIndex];
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
            settings.availableVerses = Object.keys(this.verses).reduce((a, b) => { a[b] = true; return a; }, {} as {
                [key: string]: boolean;
            });
        }
        this.settings = settings;
    }

    public get AvailableVerses() {
        return Object.entries(this.settings?.availableVerses ?? {}).filter(i => i[1] === true).map(i => i[0]);
    }

    public get currentVerses() {
        if (this.Settings) {
            const index = this.Settings.currentIndex;
            const size = this.Settings.singleVerse ? 1 : this.Settings.size;

            return this.GetVerseRange(index, size);
        }
        return [];
    }

    public GetVerseRange(index: number, size: number) {
        const verses: string[] = [];
        for (let i = 0; i < size; i++) {
            const verse = this.AvailableVerses[index + i];
            if (verse) {
                verses.push(verse);
            }
        }
        console.log(verses);
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
    }

    public toggleSingleVerse() {
        const settings = Object.assign({}, this.settings);
        settings.singleVerse = !settings.singleVerse;
        this.settings = settings;
    }

    public setTheme(theme: "dark" | "light") {
        if (this.settings) {
            this.settings.theme = theme;
            this.commit();
        }
    }
    
    public setSync(sync: boolean) {
        if (this.settings) {
            this.settings.sync = sync;
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
        this.lyrics = {
            id: lyrics.id,
            languageKey: lyrics.languageKey,
            verses: lyrics.verses,
        };
        this.settings = settings ?? {
            size: PresentationControl.getSize(lyrics.size, lyrics.hasChorus),
            availableVerses: Object.keys(lyrics.verses).reduce((a, b) => { a[b] = true; return a; }, {} as {
                [key: string]: boolean;
            }),
            currentIndex: 0,
            muted: false,
            theme: this.settings?.theme ?? "dark",
            showSideBar: this.settings?.showSideBar ?? true,
            singleVerse: this.settings?.singleVerse ?? false,
            sync: this.settings?.sync ?? false,
        };

        if (this.settings.sync) {
            this.commit()
        }
    }

    private static getSize(lyricsSize: number, hasChorus: boolean) {
        if (lyricsSize > 4) {
            return 1;
        }
        if (lyricsSize > 3 || hasChorus) {
            return 2;
        }
        return 3;
    }

    public resetSettings(lyrics: Lyrics) {
        this.settings = {
            size: PresentationControl.getSize(lyrics.size, lyrics.hasChorus),
            availableVerses: Object.keys(lyrics.verses).reduce((a, b) => { a[b] = true; return a; }, {} as {
                [key: string]: boolean;
            }),
            currentIndex: 0,
            muted: false,
            theme: this.settings?.theme ?? "dark",
            showSideBar: this.settings?.showSideBar ?? true,
            singleVerse: this.settings?.singleVerse ?? false,
            sync: this.settings?.sync ?? false,
        };
        if (this.settings.sync) {
            this.commit()
        }
    }

    public open(): void {
        this.commit();
        window.open("/presentation", "SongTreasures - Presentation View", "resizeable,scrollbars");
    }

    public get Verses() {
        return this.GetVerses(this.currentVerses);
    }

    public GetVerses(currentVerses: string[]) {
        return currentVerses.map(i => this.verses[i]).filter(i => i);
    }
}

export const presentation = new PresentationControl();
