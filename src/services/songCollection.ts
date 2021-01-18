import { Song } from "@/classes";
import api from "./api";

export class SongCollectionService {
    private _api = api.songs;
    private _songs: Song[] = [];
    private collection: Collection;

    constructor(collection: Collection) {
        this.collection = collection;
    }

    public get songs() {
        return this._songs.sort((a, b) => a.number - b.number);
    }

    public async initialize() {
        const songs = await this._api.getAllSongs(this.collection.key);
        for (const song of songs) {
            const s = new Song(song);
            s.collection = this.collection;

            this._songs.push(s);
        }
    }
}