import collectionService from "@/services/collectionService";
import productService from "@/services/productService";
import { Collection, Product } from "hiddentreasures-js";
import BaseView from "./baseView";

export default class CollectionView extends BaseView<Collection> {
    private _product: Product | null = null;
    public get product() {
        return this._product;
    }

    protected getItem(): Promise<Collection> {
        return collectionService.get(this.itemId);
    }

    protected async doLoad() {
        this._product ??= (await productService.list()).find(i => i.collectionIds.includes(this.itemId)) ?? null;
    }
}
