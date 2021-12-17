import { useStore } from "@/store";
import { ICategory, ICollectionItem, ApiContributor, ICountry, ITheme } from "songtreasures-api";

export default class CollectionItem<T extends (ApiContributor | ICountry | ITheme | ICategory)> implements ICollectionItem<T> {
    private store = useStore();

    public id;
    public item: T;
    public songIds;
    public songs?;
    public fileIds;
    public files?;

    constructor(item: ICollectionItem<T>) {
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
