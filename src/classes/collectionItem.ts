import { useStore } from "@/store";
import { ApiCategory, ApiCollectionItem, ApiContributor, ApiCountry, ApiTheme } from "dmb-api";

export class CollectionItem<T extends (ApiContributor | ApiCountry | ApiTheme | ApiCategory)> implements ApiCollectionItem<T> {
    private store = useStore();

    public id;
    public item: T;
    public songIds;
    public songs?;
    public fileIds;
    public files?;

    constructor(item: ApiCollectionItem<T>) {
        this.id = item.id;
        this.item = item.item;
        this.songIds = item.songIds;
        this.songs = item.songs;
        this.fileIds = item.fileIds;
        this.files = item.files;
    }

    public get name() {
        if (typeof(this.item.name) == "string") {
            return this.item.name;
        }
        const l = this.store.getters.languageKey;
        return this.item.name[l] ?? this.item.name.en ?? Object.values(this.item.name)[0];
    }
}
