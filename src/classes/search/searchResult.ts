import { ApiContributor } from "songtreasures";
import { ApiSearchResult } from "songtreasures/search";
import { CollectionItem, Song } from "..";
import SearchResultItem from "./searchResultItem";

export default class SearchResult implements ApiSearchResult {
    public songs: SearchResultItem<Song>[];
    public contributors: SearchResultItem<CollectionItem<ApiContributor>>[];

    constructor(item: ApiSearchResult) {
        this.songs = item.songs.map(i => new SearchResultItem(i, "song"));
        this.contributors = item.contributors.map(i => new SearchResultItem(i, "contributor"));
    }

    public get count() {
        return this.songs.length + this.contributors.length;
    }
}
