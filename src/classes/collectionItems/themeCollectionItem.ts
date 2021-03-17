import { ApiThemeCollectionItem } from "dmb-api";
import { Song } from "../song";

export class ThemeCollectionItem implements ApiThemeCollectionItem {
    public theme: Theme;
    public songIds: string[];
    public songs: Song[];

    constructor(ci: ApiThemeCollectionItem) {
        this.theme = ci.theme;
        this.songIds = ci.songIds;
        this.songs = ci.songs?.map(s => new Song(s)) ?? [];
    }

    public getName(languageKey: string) {
        return this.theme.name[languageKey] ?? this.theme.name[0];
    }
}