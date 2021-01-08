import { Song } from "@/classes";
import api from "./api";
import { SongCollectionService } from "./songCollection";

export class SongService {
    public songs: Song[] = []
    public collections: Collection[] = [];
    public collectionServices: SongCollectionService[] = [];

    public async init() {
        this.collections = await api.songs.getCollections();

        for (const collection of this.collections) {
            const service = new SongCollectionService(collection);
            await service.initialize();
            this.songs = this.songs.concat(service.songs);
        }
    }
}