import { Song } from "../song";

export class BaseCollectionItem<T> {
    public id = "";
    public item: T = {} as T;
    public songIds: string[] = [];
    public songs: Song[] = [];
}
