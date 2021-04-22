import { IDBPDatabase, openDB } from "idb";

const store = "songtreasures";

type Stores = "songs" | "contributors" | "lyrics" | "all_lyrics";

export class CacheService<T> {
    private name: Stores;
    private db?: IDBPDatabase<unknown>;

    constructor(name: Stores) {
        this.name = name;
        this.init();
    }

    public async init() {
        this.db ??= await openDB(store);
    }

    public get(key: string): Promise<T | undefined> {
        return this.db?.get(this.name, key) as Promise<T | undefined>;
    }

    public async getAll(): Promise<{
        [key: string]: T;
    }> {
        const transaction = this.db?.transaction(this.name);

        const result = await transaction?.objectStore(this.name).getAll() ?? [];
        const keys = await transaction?.objectStore(this.name).getAllKeys() ?? [];

        return keys.reduce((a, b) => a[b.toString()] = result[keys.indexOf(b)], {} as {
            [key: string]: T;
        });
    }

    public async set(key: string, value: T): Promise<void> {
        await this.db?.put(this.name, value, key);
    }

    public async setAll(value: {
        [key: string]: T;
    }) {
        const tx = this.db?.transaction(this.name, "readwrite");

        for (const key of Object.keys(value)) {
            await tx?.objectStore(this.name).add(value[key], key);
        }

        await tx?.done;
    }

    public async getAndStoreOrRetrieve(key: string, task: Promise<T>): Promise<T> {
        try {
            const result = await task;

            if (result) {
                await this.set(key, result);
                return result;
            } else {
                throw new Error("Couldn't fetch from task.");
            }
        }
        catch {
            const result = await this.get(key);

            if (result) {
                return result;
            }
            throw new Error("Couldn't fetch from cache either.");
        }
    }

    public async getAndStoreOrRetrieveAll(task: Promise<{
        [key: string]: T;
    }>) {
        try {
            const result = await task;

            if (result) {
                await this.setAll(result);
                return result;
            } else {
                throw new Error("Couldn't fetch from task.");
            }
        }
        catch {
            const result = await this.getAll();

            if (result) {
                return result;
            }
            throw new Error("Couldn't fetch from cache either.");
        }
    }
}
