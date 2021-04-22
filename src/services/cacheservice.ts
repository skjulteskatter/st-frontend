export class CacheService<T> {
    private name: Stores;
    private _db?: IDBDatabase;

    constructor(name: Stores) {
        this.name = name;
    }

    public async init() {
        this._db ??= await new Promise(resolve => {
            const o = indexedDB.open(this.name)
            o.onsuccess = () => resolve(o.result);
        });
    }

    public get db() {
        if (this._db) return this._db;

        throw new Error("DB NOT PRESENT");
    }

    public g

    public get(key: string): Promise<T | undefined> {
        const transaction = this.db

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
