import { ApiThemeCollectionItem } from "dmb-api";
import { Song } from "../song";
import { BaseCollectionItem } from "./baseCollectionItem";

export class ThemeCollectionItem extends BaseCollectionItem<Theme> {
    public songIds: string[];
    public songs: Song[];

    constructor(ci: ApiThemeCollectionItem) {
        super();
        this.item = ci.theme;
        this.songIds = ci.songIds;
        this.songs = ci.songs?.map(s => new Song(s)) ?? [];
    }

    public getName(languageKey: string) {
        return this.item.name[languageKey] ?? this.item.name[0];
    }
}