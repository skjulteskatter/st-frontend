import { ApiProduct } from "checkout";
import { BaseClass } from "./baseClass";
import { Collection } from "./collection";

export class Product extends BaseClass implements ApiProduct {
    public id;
    private _collections?: Collection[];
    public prices;
    public priority;
    public collectionIds;

    constructor(product: ApiProduct, collections: Collection[]) {
        super();
        this._collections = collections?.filter(c => product.collectionIds.includes(c.id));
        this.id = product.id;
        this.name = product.name;
        this.prices = product.prices;
        this.priority = product.priority;
        this.collectionIds = product.collectionIds;
    }

    public get collections() {
        return this._collections ?? [];
    }
}
