import { ICollection, ICustomCollection, ITag } from "songtreasures-api";
import { cache, StoreWithExpiry } from "../cache";
import { Refreshable } from "../interfaces";

type SupportedModules = ICustomCollection | ITag | ICollection

export default abstract class BaseModule<T extends TInterface & Refreshable, TInterface extends SupportedModules> {
    protected store;

    constructor(store: StoreWithExpiry) {
        this.store = store;
    }

    // private async retrieve(id: string, factory: () => Promise<TInterface>): Promise<TInterface> {
    //     return (await cache.getOrCreate(this.store, id, factory, 3600)) as TInterface;
    // }

    private async retrieveAll(factory: () => Promise<TInterface[]>) {
        return (await cache.getOrCreateHashAsync(this.store, async () => {
            const items = await factory();
            return items.reduce((a, b) => {
                a[b.id] = b;
                return a;
            }, {} as {[key: string]: TInterface});
        }, 300)) as TInterface[];
    }

    protected abstract convert: (i: TInterface) => T;

    protected abstract id: (i: TInterface, query: string) => boolean;

    protected abstract retrieveFromSource: (id: string) => () => Promise<TInterface>;
    protected abstract retrieveAllFromSource: () => () => Promise<TInterface[]>;

    public items: T[] = [];

    private _allRetrieved = false;

    public async get(id: string): Promise<T> {
        let item = this.items.find(i => this.id(i, id));
        if (!item) {
            item = this.convert(await this.retrieveFromSource(id)());
            this.items.push(item);
        }
        return item;
    }

    public async getAll(): Promise<T[]> {
        if (!this._allRetrieved) {
            const items = (await this.retrieveAll(this.retrieveAllFromSource())).map(i => this.convert(i));

            for (const item of items) {
                if (!this.items.some(i => i.id === item.id)) {
                    this.items.push(item);
                }
            }

            this._allRetrieved = true;
        }
        return this.items;
    }
}
