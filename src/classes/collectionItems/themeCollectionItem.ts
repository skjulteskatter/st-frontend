import { ApiCollectionItem } from "dmb-api";
import { Song } from "../song";
import { BaseCollectionItem } from "./baseCollectionItem";

export class ThemeCollectionItem extends BaseCollectionItem<Theme> {
    public songIds: string[];
    public songs: Song[];

    constructor(ci: ApiCollectionItem<Theme>) {
        super();
        this.item = ci.item;
        this.songIds = ci.songIds;
        this.songs = ci.songs?.map(s => new Song(s)) ?? [];
    }

    public getName(languageKey: string) {
        return this.item.name[languageKey] ?? this.item.name[0];
    }
}
