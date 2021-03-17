import { Song } from "../song";

export class BaseCollectionItem<T> {
    public item: T = {} as T;
    public songIds: string[] = [];
    public songs: Song[] = [];
}