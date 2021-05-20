import { ApiCollectionItem } from "dmb-api";
import { Song } from "../song";
import { BaseCollectionItem } from "./baseCollectionItem";


export class CountryCollectionItem extends BaseCollectionItem<Country> {
    public songIds: string[];
    public songs: Song[];

    constructor(ci: ApiCollectionItem<Country>) {
        super();
        this.item = ci.item;
        this.songIds = ci.songIds;
        this.songs = ci.songs?.map(s => new Song(s)) ?? [];
    }
}
