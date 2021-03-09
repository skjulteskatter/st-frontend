export class Product implements ProductInterface {
    public collections;
    public id;
    public name;
    public prices;
    public priority;

    constructor(product: ProductInterface) {
        this.collections = product.collections;
        this.id = product.id;
        this.name = product.name;
        this.prices = product.prices;
        this.priority = product.priority;
    }

    public getName(language: string) {
        return this.name[language] ?? this.name.en ?? this.name[Object.keys(this.name)?.filter(n => !n.startsWith("_"))[0]];
    }
}