import api from "@/services/api";
import { Contributor, Lyrics, Song } from ".";


export class Collection {
    public key: string;
    public defaultType: string;
    public id: string;
    public name: LocaleString;
    public available?: boolean;

    public getName(language: string) {
        return this.name[language] ?? this.name.en ?? this.name[Object.keys(this.name)[0]];
    }

    public image: string;

    private _initialized = false;
    private _loading = false;

    public contributors: Contributor[] = [];
    public songs: Song[] = [];
    public lyrics: Lyrics[] = [];
    public themes: ThemeCollectionItem[] = [];

    public themeTypes: Theme[] = [];

    public loadingLyrics = false;

    private _authors?: ContributorCollectionItem[];
    private _loadingAuthors = false;

    private _composers?: ContributorCollectionItem[];
    private _loadingComposers = false;
    private _loadingThemes = false;

    private _countries?: CountryCollectionItem[];
    private _loadingCountries = false;

    private _currentLanguage = '';

    constructor(collection: CollectionInterface) {
        this.key = collection.key;
        this.defaultType = collection.defaultType;
        this.id = collection.id;
        this.name = collection.name;
        this.image = collection.image;
        this.available = collection.available;
    }

    private async initialize() {
        if (!this._initialized) {
            this._initialized = true;
            this.songs = (await api.songs.getAllSongs(this.key)).map(s => new Song(s));
            this.themes = await api.songs.getAllThemes(this.key);
        }
    }

    public async load(language: string) {
        if (this._loading) return;
        this._loading = true;
        await this.initialize();

        if (this._currentLanguage != language) {
            this.lyrics = (await api.songs.getAllLyrics(this.key, language, 'json', 0)).map(l => new Lyrics(l));
            this._currentLanguage = language;
        }
        this._loading = false;
    }

    public get loading() {
        return this._loading || this._loadingAuthors || this._loadingComposers || this._loadingThemes || this._loadingCountries;
    }

    public getSong(number: number) {
        return this.songs.find(s => s.number == number);
    }

    public filteredSongs(filter: string, themes: string[] = [], origins: string[] = [], audio: string[] = [], video: string[] = [], types: string[] = []) {
        filter = filter.toLowerCase();

        const numbers: number[] = [];
        const context: {
            [key: string]: string;
        } = {};

        for (const lyrics of this.lyrics) {


            const content = lyrics.rawContent.toLowerCase();
            
            if (content.includes(filter)) {
                numbers.push(lyrics.number);

                const index = content.indexOf(filter);

                const start = (index - 20) > 0 ? index - 20 : 0;

                context[lyrics.number] = context[lyrics.number] ?? (start !== 0 ? '...' : '') + lyrics.rawContent.substr(start, filter.length + 40) + '...';

                continue;
            }

            if (lyrics.title?.includes(filter)) {
                numbers.push(lyrics.number);
                continue;
            }
        }

        for (const song of this.songs) {
            if (!numbers.includes(song.number)) {
                if (song.authors.find(a => a.name.toLowerCase().includes(filter)) || song.composers.find(c => c.name.toLowerCase().includes(filter))) {
                    numbers.push(song.number);
                    continue;
                }
            }
        }

        return {
            songs: this.songs.filter(s => (numbers.includes(s.number) || s.rawContributorNames.includes(filter)) 
                && (themes.length == 0 || s.themes.filter(t => themes.includes(t.id)).length)
                && (origins.length == 0 || origins.includes(s.melodyOrigin?.id))
                && (audio.length == 0 || s.audioFiles.filter(a => audio.includes(a.category)).length)
                && (video.length == 0 || s.videoFiles.filter(v => video.includes(v.category)).length)
                && (types.length == 0 || types.includes(s.type))
            ), context
        }
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
        if (value == 'authors') {
            if (!this._authors) {
                this._loadingAuthors = true;
                this._authors = await api.songs.getAllAuthors(this.key);
                this._loadingAuthors = false;
                return this._authors.length;
            }
        }
        if (value == 'composers') {
            if (!this._composers) {
                this._loadingComposers = true;
                this._composers = await api.songs.getAllComposers(this.key);
                this._loadingComposers = false;
                return this._composers.length;
            }
        }
        if (value == 'countries') {
            if (!this._countries) {
                this._loadingCountries = true;
                this._countries = await api.songs.getAllCountries(this.key);
                this._loadingCountries = false;
                return this._countries.length;
            }
        }

        return 1;
    }

    public async transposeLyrics(number: number, transpose: number, language?: string) {
        this.loadingLyrics = true;
        try {
            const lyrics = new Lyrics(await api.songs.getLyrics(this.key, number, language ?? this._currentLanguage, 'html', transpose));
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public async getLyrics(number: number, language: string) {
        this.loadingLyrics = true;
        try {

            let lyrics = this.lyrics.find(l => l.number == number && l.language.key == language);
            if (!lyrics) {
                lyrics = new Lyrics(await api.songs.getLyrics(this.key, number, language, 'json', 0));
                this.lyrics.push(lyrics);
            }
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public get hasAuthors(): boolean {
        return this.songs.find(s => s.authors?.length > 0) != undefined;
    }

    public get hasComposers(): boolean {
        return this.songs.find(s => s.composers?.length > 0) != undefined;
    }

    public get hasCountries(): boolean {
        return this.songs.find(s => s.originCountry) != undefined;
    }

    public get hasThemes(): boolean {
        return this.songs.find(s => s.themes?.length > 0) != undefined;
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
}