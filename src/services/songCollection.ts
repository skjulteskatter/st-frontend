import Song from "@/classes/song";
import api from "./api";

export class SongCollectionService {
    private _api = api.songs;
    private _songs: Song[] = [];
    private collection: Collection = {} as Collection;


    public get songs() {
        return this._songs.sort((a, b) => a.number - b.number);
    }

    public async initialize(collection: Collection) {
        this.collection = collection;
        this._songs = await this._api.getAllSongs(collection.key);
    }

    public getLyrics(number: number, language?: string, format?: string, transpose?: number) {
        return this._api.getLyrics(this.collection.key, number, language ?? "no", format ?? "text", transpose ?? 0);
    }
}