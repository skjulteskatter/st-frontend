import customCollectionService from "@/services/customCollectionService";
import { CustomCollection, CustomCollectionEntry } from "hiddentreasures-js";
import BaseView from "./baseView";

export default class CustomCollectionView extends BaseView<CustomCollection> {
    private _entries: CustomCollectionEntry[] | null = null;
    public get entries() {
        if (this._entries === null)
            throw this.notLoaded();
        return this._entries;
    }

    protected getItem(): Promise<CustomCollection> {
        return customCollectionService.get(this.itemId);
    }

    protected async doLoad(): Promise<void> {
        this._entries ??= await customCollectionService.getEntries(this.item.id);
    }
}
