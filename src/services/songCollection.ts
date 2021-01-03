import api from "./api";

export class SongCollectionService {
    private _api = api.songs;
    private _songs: Song[] = [];
    private collection = "";

    public songs: {
        [key: number]: Song;
    } = {};

    public async initialize(collection: string) {
        this.collection = collection;
        this._songs = await this._api.getAllSongs(collection);

        for (const song of this._songs) {
            this.songs[song.number] = song;
        }
    }

    public getLyrics(number: number, language?: string, format?: string, transpose?: number) {
        return this._api.getLyrics(this.collection, number, language ?? "no", format ?? "text", transpose ?? 0);
    }
}