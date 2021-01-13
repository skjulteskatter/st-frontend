import { Song } from "@/classes";
import { SongCollectionService } from "./songCollection";

export class SongService {
    public songs: Song[] = []
    public collections: Collection[] = [];
    public collectionServices: SongCollectionService[] = [];

    public async init(collections: Collection[]) {
        this.collections = collections;

        for (const collection of this.collections) {
            const service = new SongCollectionService(collection);
            await service.initialize();
            this.songs = this.songs.concat(service.songs);
        }
    }
}