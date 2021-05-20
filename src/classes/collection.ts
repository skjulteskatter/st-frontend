import api from "@/services/api";
import { ApiCollection, ApiCollectionItem, ApiContributor } from "dmb-api";
import { Lyrics, Song, ContributorCollectionItem, ThemeCollectionItem, CountryCollectionItem } from ".";
import { BaseClass } from "./baseClass";
// import { Converter } from "showdown";
import { cache } from "@/services/cache";
import { notify } from "@/services/notify";
import { useStore } from "@/store";
// const converter = new Converter();

let contributors: ContributorCollectionItem[];

type CollectionSettings = {
    offline: boolean;
    lastSynced?: string;
}

export const getContributors = async (offline: boolean) => {
    if (contributors) {
        return contributors;
    }

    let result: ContributorCollectionItem[] = [];

    if (offline) {
        try {
            const key = "contributors_last_updated";
            const lastUpdated = await cache.get("config", key) as string | undefined;
            const updateContributors = await api.songs.getAllContributors(lastUpdated);

            await cache.replaceEntries("contributors", updateContributors.reduce((a, b) => {
                a[b.id] = b;
                return a;
            }, {} as {
                [id: string]: ApiCollectionItem<ApiContributor>;
            }));

            const now = new Date();

            await cache.set("config", key, new Date(now.getTime() - 172800).toISOString());
        }
        catch (e) {
            notify("error", "Error occured", "warning", e);
            result = (await api.songs.getAllContributors()).map(c => new ContributorCollectionItem(c));
        }
        result = result.length > 0 ? result : (await cache.getAll("contributors")).map(c => new ContributorCollectionItem(c));
    } else {
        result = (await api.songs.getAllContributors()).map(c => new ContributorCollectionItem(c));
    }
    // try {
    //     try {
    //         const key = "contributors_last_updated";
    //         const lastUpdated = (await cache.get("config", key))?.value as string | undefined;
    //         const updateContributors = await api.songs.getAllContributors(lastUpdated);

    //         await cache.replaceEntries("contributors", updateContributors.reduce((a, b) => {
    //             a[b.id] = b;
    //             return a;
    //         }, {} as {
    //             [id: string]: ApiContributorCollectionItem;
    //         }));

    //         const now = new Date();

    //         await cache.set("config", key, {
    //             id: key,
    //             value: new Date(now.getTime() - 172800).toISOString(),
    //         });

    //         const cs = await cache.getAll("contributors");

    //         result = cs.map(c => new ContributorCollectionItem(c));
    //     }
    //     catch (e) {
    //         if (result.length < 10) {
    //             throw e;
    //         }
    //     }
    // }
    // catch (e) {
    //     notify("error", "Error occured", "warning", e);
    //     result = (await api.songs.getAllContributors()).map(c => new ContributorCollectionItem(c));

    //     try {
    //         await cache.setAll("contributors", result);
    //     }
    //     catch {
    //         // eslint-disable-next-line no-console
    //         console.log("Tried caching all contributors");
    //     }
    // }

    contributors = result.sort((a, b) => a.item.name > b.item.name ? 1 : -1);

    return contributors;
};

export class Collection extends BaseClass implements ApiCollection {
    private store = useStore();
    private _key;
    public keys: LocaleString;
    public defaultType;
    public id;
    public available?: boolean;
    public details?: LocaleString;
    public hasChords: {
        [lang: string]: boolean;
    };

    public image: string;

    public settings?: CollectionSettings;

    private _initialized = false;
    private _loading = false;

    public contributors?: ContributorCollectionItem[];
    public songs: Song[] = [];
    public lyrics: Lyrics[] = [];
    
    public hasAuthors = false;

    public hasComposers = false;

    public hasCountries = false;

    public hasThemes = false;

    public themeTypes: Theme[] = [];

    public loadingLyrics = false;

    private _themes?: ThemeCollectionItem[];
    private _loadingThemes = false;

    private _authors?: ContributorCollectionItem[];
    private _composers?: ContributorCollectionItem[];
    private _countries?: CountryCollectionItem[];
    private _loadingCountries = false;

    private _currentLanguage = "";

    constructor(collection: ApiCollection) {
        super();
        this._key = collection.key;
        this.keys = collection.keys ?? {};
        this.defaultType = collection.defaultType;
        this.id = collection.id;
        this.name = collection.name;
        this.image = collection.image;
        this.available = collection.available;
        this.details = collection.details;
        this.hasChords = collection.hasChords ?? {};
        cache.get("config", "collection_" + this.id).then((r) => {
            this.settings = JSON.parse(r as string | undefined ?? "{\"offline\": false}") as CollectionSettings;
        });
    }

    public get key() {
        return this.keys[this.store.getters.languageKey] ?? this._key;
    }

    public getKeys() {
        const keys = Object.entries(this.keys).map(e => e[1]);
        return keys.length ? keys : [this.key];
    }

    public async setSettings(settings: CollectionSettings) {
        this.settings = settings;
        await cache.set("config", "collection_" + this.id, JSON.stringify(settings));
    }

    private async initialize() {
        if (!this._initialized) {
            this._initialized = true;

            if (this.settings?.offline) {
                if (navigator.onLine) {
                    try {
                        const key = "songs_lastUpdated_" + this.id;
                        const lastUpdated = await cache.get("config", key) as string | undefined;
                        const updateSongs = await api.songs.getAllSongs(this, lastUpdated);
    
                        await cache.replaceEntries("songs", updateSongs.reduce((a, b) => {
                            a[b.id] = b;
                            return a;
                        }, {} as {
                            [id: string]: Song;
                        }));

                        const now = new Date();

                        await cache.set("config", key, new Date(now.getTime() - 172800).toISOString());
                    }
                    catch(e) {
                        notify("error", "Error occured", "warning", e);
                        this.songs = await api.songs.getAllSongs(this);
                    }
                }
                
                this.songs = this.songs.length > 0 ? this.songs : (await cache.getAll("songs")).filter(s => s.collectionIds.some(col => col == this.id)).sort((a, b) => a.number - b.number);
            } else {
                this.songs = await api.songs.getAllSongs(this);
            }

            // try {
            //     try {
            //         const key = "songs_lastUpdated_" + this.id;
            //         const lastUpdated = (await cache.get("config", key))?.value as string | undefined;
                    
            //         const updateSongs = await api.songs.getAllSongs(this, lastUpdated);
    
            //         await cache.replaceEntries("songs", updateSongs.reduce((a, b) => {
            //             a[b.id] = b;
            //             return a;
            //         }, {} as {
            //             [id: string]: Song;
            //         }));
    

            //         const now = new Date();

            //         await cache.set("config", key, {
            //             id: key,
            //             value: new Date(now.getTime() - 172800).toISOString(),
            //         });

            //         this.songs = (await cache.getAll("songs")).filter(s => s.collectionId == this.id).sort((a, b) => a.number - b.number);
            //     }
            //     catch (e) {
            //         this.songs = (await cache.getAll("songs")).filter(s => s.collectionId == this.id).sort((a, b) => a.number - b.number);

            //         if (this.songs.length < 10) {
            //             throw e;
            //         }
            //     }
            // }
            // catch (e) {
            //     notify("error", "Error occured", "warning", e);
            //     this.songs = await api.songs.getAllSongs(this);
            // }

            this.hasAuthors = this.hasAuthors || this.songs.some(s => s.participants.some(p => p.type == "author"));
            this.hasComposers = this.hasComposers || this.songs.some(s => s.participants.some(p => p.type == "composer"));
            this.hasThemes = this.hasThemes || this.songs.some(s => s.themes.length > 0);
            this.hasCountries = this.hasCountries || this.songs.some(s => s.originCountry !== undefined);
        }
    }
    
    public async load(language: string) {
        if (this._loading) return;
        this._loading = true;
        await this.initialize();

        if (this._currentLanguage != language) {

            if (this.settings?.offline) {
                if (navigator.onLine) {
                    try {
                        const key = "lyrics_lastUpdated_" + this.id + "_" + language;
                        const lastUpdated = await cache.get("config", key) as string | undefined;
                        const updateLyrics = await api.songs.getAllLyrics(this, language, "json", 0, lastUpdated);
    
                        await cache.replaceEntries("lyrics", updateLyrics.reduce((a, b) => {
                            a[b.id] = b;
                            return a;
                        }, {} as {
                            [id: string]: Lyrics;
                        }));
    
                        const now = new Date();
    
                        await cache.set("config", key, new Date(now.getTime() - 172800).toISOString());
                    }
                    catch(e) {
                        notify("error", "Error occured", "warning", e);
                        this.lyrics = await api.songs.getAllLyrics(this, language, "json", 0);
                    }
                }

                this.lyrics = this.lyrics.length > 0 ? this.lyrics : this.lyrics = (await cache.getAll("lyrics")).filter(l => l.collectionIds.some(col => col == this.id));
            } else {
                this.lyrics = await api.songs.getAllLyrics(this, language, "json", 0);
            }
            this._currentLanguage = language;
        }

        this._loading = false;
    }

    private async loadContributors() {
        this.contributors = (await getContributors(this.settings?.offline == true)).filter(c => this.songs.some(s => s.participants.some(p => p.contributorId == c.id)));
    }

    public get loading() {
        return this._loading || this._loadingThemes || this._loadingCountries;
    }

    public getDetails(language: string){
        return this.getTranslatedProperty(this.details, language);
    }

    public getSong(number: number) {
        return this.songs.find(s => s.number == number);
    }

    public filteredSongs(filter: string, songFilter: SongFilter) {
        filter = filter.toLowerCase();

        const context: {
            [key: string]: string;
        } = {};

        const number = parseInt(filter);

        let numbers: number[] = [];
        
        if (number) {
            numbers = this.songs.filter(s => s.number == number || s.number.toString().includes(number.toString())).map(s => s.number);
        } else {
            for (const song of this.songs) {
                if (!numbers.includes(song.number)) {
                    if (song.names.find(n => n.toLowerCase().includes(filter)) || song.id.toLowerCase().includes(filter)) {
                        numbers.push(song.number);
                        continue;
                    }
                    if (song.authors.find(a => a.name.toLowerCase().includes(filter)) || song.composers.find(c => c.name.toLowerCase().includes(filter))) {
                        numbers.push(song.number);
                        continue;
                    }
                }
            }

            for (const lyrics of this.lyrics) {
                if (numbers.includes(lyrics.number)) continue;

                const content = lyrics.rawContent.toLowerCase();
                
                if (content.includes(filter)) {
                    numbers.push(lyrics.number);
    
                    const index = content.indexOf(filter);
    
                    const start = (index - 20) > 0 ? index - 20 : 0;
    
                    context[lyrics.number] = context[lyrics.number] ?? (start !== 0 ? "..." : "") + lyrics.rawContent.substr(start, filter.length + 40) + "...";
    
                    continue;
                }
    
                if (lyrics.title?.includes(filter)) {
                    numbers.push(lyrics.number);
                    continue;
                }
            }
        }

        const {themes, audioFiles, videoFiles, origins, contentTypes, sheetMusicTypes } = songFilter;

        const songs = this.songs.filter(s => 
            (numbers.includes(s.number) || s.rawContributorNames.includes(filter)) 
            && (themes.length == 0 || s.themes.filter(t => themes.includes(t.id)).length)
            && (origins.length == 0 || (s.melodyOrigin != null && origins.includes(s.melodyOrigin.country)))
            && (audioFiles.length == 0 || s.audioFiles.filter(a => audioFiles.includes(a.category)).length)
            && (videoFiles.length == 0 || s.videoFiles.filter(v => videoFiles.includes(v.category)).length)
            && (contentTypes.length == 0 || (contentTypes.includes("lyrics") 
                && s.hasLyrics) || (contentTypes.includes("audio") 
                && s.audioFiles.length > 0) || (contentTypes.includes("video") 
                && s.videoFiles.length > 0) || (contentTypes.includes("sheetmusic") 
                && s.sheetMusic.length > 0) )
            && (sheetMusicTypes.length == 0 || s.sheetMusic.find(sm => sheetMusicTypes.includes(sm.category))),
        );

        return {
            songs,
            context,
        };
    }

    public get origins() {
        const origins: Origin[] = [];

        for (const song of this.songs) {
            if (song.melodyOrigin != undefined && !origins.find(o => o.country == song.melodyOrigin?.country)) {
                origins.push(song.melodyOrigin);
            }
        }

        return origins;
    }

    public async getList(value: string) {
        if (value == "authors") {
            if (!this._authors) {
                if (!this.contributors)
                    await this.loadContributors();
                this._authors = this.contributors?.filter(c => this.songs.some(s => s.participants.some(p => p.contributorId == c.item.id && p.type == "author"))) ?? [];
                return this._authors.length;
            }
        }
        if (value == "composers") {
            if (!this._composers) {
                if (!this.contributors)
                    await this.loadContributors();
                this._composers = this.contributors?.filter(c => this.songs.some(s => s.participants.some(p => p.contributorId == c.item.id && p.type == "composer"))) ?? [];
                return this._composers.length;
            }
        }
        if (value == "countries") {
            if (!this._countries) {
                this._loadingCountries = true;
                const countries = await api.songs.getAllCountries(this);

                this._countries = countries.map(c => new CountryCollectionItem(c));

                this._loadingCountries = false;
                return this._countries?.length;
            }
        }
        if (value == "themes") {
            if (!this._themes) {
                this._loadingThemes = true;

                const themes = await api.songs.getAllThemes(this);

                this._themes = themes.map(t => new ThemeCollectionItem(t));

                this._loadingThemes = false;
                return this._themes.length;
            }
        }

        return 1;
    }

    public async transposeLyrics(number: number, transpose: number, language?: string, transcode?: string): Promise<Lyrics> {
        this.loadingLyrics = true;
        try {
            let lyrics = this.lyrics.find(l => l.number == number && l.languageKey == language && l.format == "html" && l.transposition == transpose);
            if (!lyrics) {
                lyrics = await api.songs.getLyrics(this, number, language ?? this._currentLanguage, "html", transpose, transcode ?? "common");
                this.lyrics.push(lyrics);
            }
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public async getLyrics(number: number, language: string): Promise<Lyrics> {
        this.loadingLyrics = true;
        try {

            let lyrics = this.lyrics.find(l => l.number == number && l.languageKey == language);
            if (!lyrics) {
                lyrics = new Lyrics(await api.songs.getLyrics(this, number, language, "json", 0, "common"));
                this.lyrics.push(lyrics);
            }
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public get authors(): ContributorCollectionItem[] {
        return this._authors ?? [];
    }

    public get composers(): ContributorCollectionItem[] {
        return this._composers ?? [];
    }

    public get countries(): CountryCollectionItem[] {
        return this._countries ?? [];
    }

    public get themes(): ThemeCollectionItem[] {
        return this._themes ?? [];
    }

    public getContributors(type: string) {
        if (type == "authors") {
            return this.authors;
        } else if (type == "composers") {
            return this.composers;
        } else {
            return [];
        }
    }
}
