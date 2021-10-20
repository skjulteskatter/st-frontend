import router from "@/router";
import { appSession } from "@/services/session";
import { ApiContributor } from "songtreasures";
import { ApiSearchResultItem } from "songtreasures/search";
import { CollectionItem, Song } from "..";

type SearchResultItemTypes = "song" | "contributor";

export default class SearchResultItem<T extends Song | CollectionItem<ApiContributor>> implements ApiSearchResultItem {
    public id;
    public context;

    public type: SearchResultItemTypes;

    constructor(i: ApiSearchResultItem, t: SearchResultItemTypes) {
        this.id = i.id;
        this.context = i.context;

        this.type = t;
    }

    public get item(): T {
        let item;
        if (this.type === "contributor") {
            item = appSession.contributors.find(i => i.id === this.id);
        } else if (this.type === "song") {
            item = appSession.songs.find(i => i.id === this.id);
        }
        if (!item) {
            throw new Error("Item not found");
        }
        return item as T;
    }

    public get Song() {
        if (this.type === "song")
            return this.item as Song;
        
        throw new Error("No song on item");
    }

    public get Contributor() {
        if (this.type === "contributor")
            return (this.item as CollectionItem<ApiContributor>).item;
        
        throw new Error("No contributor on item");
    }

    public view() {
        if (this.type === "contributor") {
            router.push({
                name: "contributor",
                params: {
                    contributor: this.id,
                },
            });
        } else if (this.type === "song") {
            (this.item as Song).view();
        }
    }

    public get collections() {
        const colIds = this.type === "song" ? this.Song.collectionIds : [];
        return appSession.collections.filter(i => colIds.includes(i.id));
    }
}
