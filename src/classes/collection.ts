import api from "@/services/api";
import { ApiCollection, ApiContributorCollectionItem, ApiCountryCollectionItem, ApiThemeCollectionItem } from "dmb-api";
import { Lyrics, Song, ContributorCollectionItem, ThemeCollectionItem, CountryCollectionItem } from ".";
import { BaseClass } from "./baseClass";
import { Converter } from "showdown";
import { cache } from "@/services/cache";
import { notify } from "@/services/notify";
const converter = new Converter();

export class Collection extends BaseClass implements ApiCollection {
    public key;
    public keys: LocaleString;
    public defaultType;
    public id;
    public available?: boolean;
    public details?: LocaleString;

    public image: string;

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
    private _loadingAuthors = false;

    private _composers?: ContributorCollectionItem[];
    private _loadingComposers = false;

    private _countries?: CountryCollectionItem[];
    private _loadingCountries = false;

    private _currentLanguage = "";

    constructor(collection: ApiCollection) {
        super();
        this.key = collection.key;
        this.keys = collection.keys ?? {};
        this.defaultType = collection.defaultType;
        this.id = collection.id;
        this.name = collection.name;
        this.image = collection.image;
        this.available = collection.available;
        this.details = collection.details;
    }

    public getKey(language: string) {
        return this.keys[language] ?? this.key;
    }

    public getKeys() {
        const keys = Object.entries(this.keys).map(e => e[1]);
        return keys.length ? keys : [this.key];
    }

    private async initialize() {
        if (!this._initialized) {
            this._initialized = true;

            try {
                try {
                    const key = "songs_lastUpdated_" + this.key;
                    const lastUpdated = (await cache.get("config", key))?.value as string | undefined;
                    
                    const updateSongs = await api.songs.getAllSongs(this, lastUpdated);
    
                    await cache.replaceEntries("songs", updateSongs.reduce((a, b) => {
                        a[b.id] = b;
                        return a;
                    }, {} as {
                        [id: string]: Song;
                    }));
    
                    await cache.set("config", key, {id: key, value: new Date().toISOString()});

                    this.songs = (await cache.getAll("songs")).filter(s => s.collectionId == this.id).sort((a, b) => a.number - b.number);
                }
                catch (e) {
                    this.songs = (await cache.getAll("songs")).filter(s => s.collectionId == this.id).sort((a, b) => a.number - b.number);

                    if (this.songs.length < 10) {
                        throw e;
                    }
                }
            }
            catch (e) {
                notify("error", "Error occured", "warning", e);
                this.songs = await api.songs.getAllSongs(this);
            }

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
            try {
                const key = "lyrics_lastUpdated_" + this.key + "_" + language;
                const lastUpdated = (await cache.get("config", key))?.value as string | undefined;
                const updateLyrics = await api.songs.getAllLyrics(this, language, "json", 0, lastUpdated);

                await cache.replaceEntries("lyrics", updateLyrics.reduce((a, b) => {
                    a[b.id] = b;
                    return a;
                }, {} as {
                    [id: string]: Lyrics;
                }));

                await cache.set("config", key, {id: key, value: new Date().toISOString()});

                this.lyrics = (await cache.getAll("lyrics")).filter(l => l.collectionId == this.id);
            }
            catch (e) {
                notify("error", "Error occured", "warning", e);
                this.lyrics = await api.songs.getAllLyrics(this, language, "json", 0);
            }

            //this.lyrics = await api.songs.getAllLyrics(this.key, language, "json", 0);
            this._currentLanguage = language;
        }

        this._loading = false;
    }

    public get loading() {
        return this._loading || this._loadingAuthors || this._loadingComposers || this._loadingThemes || this._loadingCountries;
    }

    public getDetails(language: string){
        const details = this.getTranslatedProperty(this.details, language);

        return details ? converter.makeHtml(details) : undefined;
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
            && (origins.length == 0 || origins.includes(s.melodyOrigin?.id))
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
            if (song.melodyOrigin != undefined && !origins.find(o => o.id == song.melodyOrigin.id)) {
                origins.push(song.melodyOrigin);
            }
        }

        return origins;
    }

    // private async fetchContributors() {
    //     try {
    //         const key = "contributors_" + this.key;
    //         const lastUpdated = (await cache.get("config", key))?.value as string | undefined;
    //         const contributors = await api.songs.getAllContributors(this.key, lastUpdated);

    //         await cache.replaceEntries("contributors", contributors.reduce((a, b) => {
    //             a[b.id] = b;
    //             return a;
    //         }, {} as {
    //             [id: string]: ContributorCollectionItem;
    //         }));

    //         await cache.set("config", key, {id: key, value: new Date().toISOString()});

    //         this.contributors = await cache.getAll("contributors");
    //     }
    //     catch (e) {
    //         notify("error", "Error occured", "warning", e);
    //         this.contributors = await api.songs.getAllContributors(this.key);
    //     }
    // }

    public async getList(value: string) {
        // if (!this.contributors) {
        //     await this.fetchContributors();
        // }
        if (value == "authors") {
            if (!this._authors) {
                this._loadingAuthors = true;

                const key = "authors_" + this.key;

                const getAuthors = async () => (await cache.get("items", key))?.value as ApiContributorCollectionItem[] ?? [];

                try {
                    const lastUpdated = (await cache.get("config", "last_updated_" + key))?.value as string | undefined;
                    const authors = [...await getAuthors(), ...await api.songs.getAllAuthors(this, lastUpdated)].reduce((a, b) => a.some(c => c.contributor.id == b.contributor.id) ? a : [...a, b], [] as ApiContributorCollectionItem[]);
                    this._authors = authors.map(c => new ContributorCollectionItem(c));

                    await cache.set("items", key, {
                        id: key,
                        value: authors,
                    });
                    await cache.set("config", "last_updated_" + key, {
                        id: "last_updated_" + key,
                        value: new Date().toISOString(),
                    });
                } 
                catch {
                    this._authors = (await getAuthors()).map(c => new ContributorCollectionItem(c));
                }
                this._loadingAuthors = false;
                return this._authors.length;
            }
        }
        if (value == "composers") {
            if (!this._composers) {
                this._loadingComposers = true;

                const key = "composers_" + this.key;

                const getComposers = async () => ((await cache.get("items", key))?.value as ApiContributorCollectionItem[] ?? []);

                try {
                    const lastUpdated = (await cache.get("config", "last_updated_" + key))?.value as string | undefined;
                    const composers = [...await getComposers(), ...await api.songs.getAllComposers(this, lastUpdated)].reduce((a, b) => a.some(c => c.contributor.id == b.contributor.id) ? a : [...a, b], [] as ApiContributorCollectionItem[]);
                    this._composers = composers.map(c => new ContributorCollectionItem(c));

                    await cache.set("items", key, {
                        id: key,
                        value: composers,
                    });
                    await cache.set("config", "last_updated_" + key, {
                        id: "last_updated_" + key,
                        value: new Date().toISOString(),
                    });
                } 
                catch {
                    this._composers = (await getComposers()).map(c => new ContributorCollectionItem(c));
                }

                this._loadingComposers = false;
                return this._composers.length;
            }
        }
        if (value == "countries") {
            if (!this._countries) {
                this._loadingCountries = true;

                const key = "countries_" + this.key;

                try {
                    const countries = await api.songs.getAllCountries(this);

                    this._countries = countries.map(c => new CountryCollectionItem(c));

                    await cache.set("items", key, {
                        id: key,
                        value: countries,
                    });
                }
                catch {
                    this._countries = ((await cache.get("items", key))?.value as ApiCountryCollectionItem[] ?? []).map(c => new CountryCollectionItem(c));
                }

                this._loadingCountries = false;
                return this._countries.length;
            }
        }
        if (value == "themes") {
            if (!this._themes) {
                this._loadingThemes = true;

                const key = "themes_" + this.key;
                
                try {
                    const themes = await api.songs.getAllThemes(this);

                    this._themes = themes.map(t => new ThemeCollectionItem(t));

                    await cache.set("items", key, {
                        id: key,
                        value: themes,
                    });
                }
                catch {
                    this._themes = ((await cache.get("items", key))?.value as ApiThemeCollectionItem[] ?? []).map(t => new ThemeCollectionItem(t));
                }

                this._loadingThemes = false;
                return this._themes.length;
            }
        }

        return 1;
    }

    public async transposeLyrics(number: number, transpose: number, language?: string, transcode?: string): Promise<Lyrics> {
        this.loadingLyrics = true;
        try {
            const lyrics = await api.songs.getLyrics(this, number, language ?? this._currentLanguage, "html", transpose, transcode ?? "common");
            this.lyrics.push(lyrics);
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public async getLyrics(number: number, language: string): Promise<Lyrics> {
        this.loadingLyrics = true;
        try {

            let lyrics = this.lyrics.find(l => l.number == number && l.language.key == language);
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
