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
        this._songs = await this._api.getAllSongs(this.collection.key);
    }
}