import { ApiProduct } from "dmb-api";
import { BaseClass } from "./baseClass";

export class Product extends BaseClass implements ApiProduct {
    public collections;
    public id;
    public prices;
    public priority;

    constructor(product: ApiProduct) {
        super();
        this.collections = product.collections;
        this.id = product.id;
        this.name = product.name;
        this.prices = product.prices;
        this.priority = product.priority;
    }
}