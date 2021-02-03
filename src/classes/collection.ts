import api from "@/services/api";
import { Contributor, Lyrics, Song } from ".";


export class Collection {
    public key: string;
    public id: string;
    public name: LocaleString;
    public image: string;

    private _initialized = false;
    private _loading = false;

    public contributors: Contributor[] = [];
    public songs: Song[] = [];
    public lyrics: Lyrics[] = [];

    private _authors: ContributorCollectionItem[] = [];
    private _loadingAuthors = false;

    private _composers: ContributorCollectionItem[] = [];
    private _loadingComposers = false;

    private _themes: ThemeCollectionItem[] = [];
    private _loadingThemes = false;

    private _currentLanguage = '';

    constructor(collection: CollectionInterface) {
        this.key = collection.key;
        this.id = collection.id;
        this.name = collection.name;
        this.image = collection.image;
    }

    private async initialize() {
        if (!this._initialized) {
            this.contributors = (await api.songs.getAllContributors(this.key)).map(c => new Contributor(c.contributor));
            this.songs = (await api.songs.getAllSongs(this.key)).map(s => new Song(s, this.contributors));
            this._initialized = true;
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

    public getSong(number: number) {
        return this.songs.find(s => s.number == number);
    }

    public getContributor(id: string) {
        return this.contributors.find(c => c.id == id);
    }

    public async transposeLyrics(number: number, transpose: number) {
        return new Lyrics(await api.songs.getLyrics(this.key, number, this._currentLanguage, 'html', transpose));
    }

    public get authors(): ContributorCollectionItem[] {
        if (!this._loadingAuthors) {
            this._loadingAuthors = true;
            api.songs.getAllAuthors(this.key).then(result => {
                this._authors = result;
            });
        }
        return this._authors;
    }

    public get composers() {
        if (!this._loadingComposers) {
            this._loadingComposers = true;
            api.songs.getAllComposers(this.key).then(result => {
                this._composers = result;
            });
        }
        return this._composers;
    }

    public get themes(): ThemeCollectionItem[] {
        if (!this._loadingThemes) {
            this._loadingThemes = true;
            api.songs.getAllThemes(this.key).then(result => {
                this._themes = result;
            });
        }
        return this._themes;
    }
}