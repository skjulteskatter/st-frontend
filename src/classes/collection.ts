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
        await this.initialize();

        if (this._currentLanguage != language) {
            this.lyrics = (await api.songs.getAllLyrics(this.key, language, 'json', 0)).map(l => new Lyrics(l));
            this._currentLanguage = language;
        }
    }

    public getSong(number: number) {
        return this.songs.find(s => s.number == number);
    }

    public getLyrics(number: number) {
        return this.lyrics.find(l => l.number == number);
    }

    public async transposeLyrics(number: number, transpose: number) {
        return new Lyrics(await api.songs.getLyrics(this.key, number, this._currentLanguage, 'html', transpose));
    }
}