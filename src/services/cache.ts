/** eslint-ignore */
import { IDBPDatabase, openDB } from "idb"; 

class CacheService<T> {
    private name: string;
    private _db?: IDBPDatabase<unknown>;

    constructor(name: string) {
        this.name = name;
    }

    public async init() {
        const name = this.name;
        this._db ??= await openDB("songtreasures", 2, {
            upgrade(db, odb, version, tx) {
                if (!db.objectStoreNames.contains(name)) {
                    db.createObjectStore(name);
                }
            },
        });
        return this._db;
    }

    public async db() {
        if (this._db) return this._db;
        return await this.init();
    }

    public async get(key: string): Promise<T | undefined> {
        return (await this.db()).get(this.name, key) as Promise<T | undefined>;
    }

    public async getAll(): Promise<T[]> {
        const transaction = (await this.db()).transaction(this.name);

        const result = await transaction?.objectStore(this.name).getAll() ?? [];

        await transaction.done;

        return result as T[];
    }

    public async set(key: string, value: T): Promise<void> {
        await (await this.db())?.put(this.name, value, key);
    }

    public async setAll(value: {
        [key: string]: T;
    }) {
        const tx = (await this.db()).transaction(this.name, "readwrite");

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

// export class CacheService<T> {

// }


export {
    CacheService,
};
