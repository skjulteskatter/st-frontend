import { ApiCountryCollectionItem } from "dmb-api";
import { Song } from "../song";


export class CountryCollectionItem implements ApiCountryCollectionItem {
    public country: Country;
    public songIds: string[];
    public songs: Song[];

    constructor(ci: ApiCountryCollectionItem) {
        this.country = ci.country;
        this.songIds = ci.songIds;
        this.songs = ci.songs?.map(s => new Song(s)) ?? [];
    }
}