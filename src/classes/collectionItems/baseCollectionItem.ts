import { ApiSong, MediaFile } from "dmb-api";

export class BaseCollectionItem<T> {
    public id = "";
    public item: T = {} as T;
    public songIds: string[] = [];
    public songs?: ApiSong[] = [];
    public fileIds: string[] = [];
    public files?: MediaFile[] = [];
}
