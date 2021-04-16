import api from "@/services/api";
import { SongFilter } from "@/store/songs";
import { ApiCollection } from "dmb-api";
import { Contributor, Lyrics, Song, ContributorCollectionItem, ThemeCollectionItem, CountryCollectionItem } from ".";
import { BaseClass } from "./baseClass";
import { Converter } from "showdown";
const converter = new Converter();


export class Collection extends BaseClass implements ApiCollection {
    public key: string;
    public defaultType: string;
    public id: string;
    public available?: boolean;
    public details?: LocaleString;

    public image: string;

    private _initialized = false;
    private _loading = false;

    public contributors: Contributor[] = [];
    public songs: Song[] = [];
    public lyrics: Lyrics[] = [];
    public themes: ThemeCollectionItem[] = [];
    
    public hasAuthors = false;

    public hasComposers = false;

    public hasCountries = false;

    public hasThemes = false;

    public themeTypes: Theme[] = [];

    public loadingLyrics = false;

    private _authors?: ContributorCollectionItem[];
    private _loadingAuthors = false;

    private _composers?: ContributorCollectionItem[];
    private _loadingComposers = false;
    private _loadingThemes = false;

    private _countries?: CountryCollectionItem[];
    private _loadingCountries = false;

    private _currentLanguage = "";

    constructor(collection: ApiCollection) {
        super();
        this.key = collection.key;
        this.defaultType = collection.defaultType;
        this.id = collection.id;
        this.name = collection.name;
        this.image = collection.image;
        this.available = collection.available;
        this.details = collection.details;
    }

    private async initialize() {
        if (!this._initialized) {
            this._initialized = true;
            this.songs = await api.songs.getAllSongs(this.key);

            for (const song of this.songs) {
                this.hasAuthors = this.hasAuthors || song.participants.find(p => p.type == "author") !== undefined;
                this.hasComposers = this.hasComposers || song.participants.find(p => p.type == "composer") !== undefined;
                this.hasThemes = this.hasThemes || song.themes.length > 0;
                this.hasCountries = this.hasCountries || song.originCountry !== undefined;
            }

            this.themes = await api.songs.getAllThemes(this.key);
        }
    }

    public async load(language: string) {
        if (this._loading) return;
        this._loading = true;
        await this.initialize();

        if (this._currentLanguage != language) {
            this.lyrics = await api.songs.getAllLyrics(this.key, language, "json", 0);
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

    public async getList(value: string) {
        if (value == "authors") {
            if (!this._authors) {
                this._loadingAuthors = true;
                this._authors = await api.songs.getAllAuthors(this.key);
                this._loadingAuthors = false;
                return this._authors.length;
            }
        }
        if (value == "composers") {
            if (!this._composers) {
                this._loadingComposers = true;
                this._composers = await api.songs.getAllComposers(this.key);
                this._loadingComposers = false;
                return this._composers.length;
            }
        }
        if (value == "countries") {
            if (!this._countries) {
                this._loadingCountries = true;
                this._countries = await api.songs.getAllCountries(this.key);
                this._loadingCountries = false;
                return this._countries.length;
            }
        }

        return 1;
    }

    public async transposeLyrics(number: number, transpose: number, language?: string, transcode?: string): Promise<Lyrics> {
        this.loadingLyrics = true;
        try {
            const lyrics = await api.songs.getLyrics(this.key, number, language ?? this._currentLanguage, "html", transpose, transcode ?? "common");
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
                lyrics = new Lyrics(await api.songs.getLyrics(this.key, number, language, "json", 0, "common"));
                this.lyrics.push(lyrics);
            }
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public get authors(): ContributorCollectionItem[] {
        return this._authors ? this._authors : [];
    }

    public get composers(): ContributorCollectionItem[] {
        return this._composers ? this._composers : [];
    }

    public get countries(): CountryCollectionItem[] {
        return this._countries ? this._countries : [];
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
