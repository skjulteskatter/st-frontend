import { IDBPDatabase, openDB } from "idb";


type Store = "songs" | "contributors";
type Stores = Store[];


class CacheService {
    private dbName = "songtreasures";
    private stores: Stores = [
        "songs",
        "contributors",
    ];
    private version = 1;
    private _db?: IDBPDatabase;

    public async init() {
        const v = this.version;
        const stores = this.stores;
        const db = await openDB(this.dbName, v, {
            upgrade(db) {
                for (const store of stores) {
                    db.createObjectStore(store);
                }
            },
        });
        this._db = db;
        return this._db;
    }

    private async db() {
        return this._db ?? await this.init();
    }

    private async tx(store: Store, write = false) {
        return (await this.db()).transaction(store, write ? "readwrite" : "readonly");
    }

    public async set<T>(store: Store, key: string, value: T): Promise<void> {
        const tx = await this.tx(store, true);

        await tx.objectStore(store).put?.(value, key);

        await tx.done;
    }

    public async get<T>(store: Store, key: string): Promise<T> {
        const tx = await this.tx(store);

        const result = await tx.objectStore(store).get(key);
        
        await tx.done;

        return result as T;
    }
}

const cache = new CacheService();

export {
    cache,
};
