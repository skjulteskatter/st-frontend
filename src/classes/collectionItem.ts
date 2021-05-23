import { ApiCollectionItem } from "dmb-api";

export class CollectionItem<T> implements ApiCollectionItem<T> {
    public id;
    public item;
    public songIds;
    public songs?;
    public fileIds;
    public files?;

    constructor(item: ApiCollectionItem<T>) {
        this.id = item.id;
        this.item = item.item;
        this.songIds = item.songIds;
        this.songs = item.songs;
        this.fileIds = item.fileIds;
        this.files = item.files;
    }
}
