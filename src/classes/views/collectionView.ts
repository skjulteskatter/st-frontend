import collectionService from "@/services/collectionService";
import productService from "@/services/productService";
import { Collection, Product } from "hiddentreasures-js";
import BaseView from "./baseView";

export default class CollectionView extends BaseView<Collection> {
    private _product: Product | null = null;
    public get product() {
        return this._product;
    }

    protected async doLoad() {
        if (!this.item) {
            this.item = await collectionService.get(this.itemId);
        }
        this._product ??= (await productService.list()).find(i => i.collectionIds.includes(this.itemId)) ?? null;
    }
}
