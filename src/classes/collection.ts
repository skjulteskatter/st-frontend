import api from "@/services/api";
import Contributor from "./contributor";
import { Lyrics } from "./lyrics";
import { Song } from "./song";


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

    public async transposeLyrics(number: number, transpose: number) {
        return new Lyrics(await api.songs.getLyrics(this.key, number, this._currentLanguage, 'html', transpose));
    }

    public get authors() {
        return this.contributors.filter(c => this.songs.map(s => s.authors.map(a => a.id)).some(s => s.includes(c.id)));
    }

    public get composers() {
        return this.contributors.filter(c => this.songs.map(s => s.composers.map(a => a.id)).some(s => s.includes(c.id)));
    }
}