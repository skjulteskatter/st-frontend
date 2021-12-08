import { ICustomCollection, ISong, ITag, IChapter, IBook, ITranslation, IScripture } from "songtreasures";
import { openDB } from "idb";

type EntryWithExpiry<T> = {
    expiry: Date;
    entry: T;
}

type StoreTypes = {
    songs: ISong;
    tags: ITag;
    custom_collections: ICustomCollection;
    chapters: IChapter;
    books: IBook;
    translations: ITranslation;
    scriptures: IScripture;
}

type Store = "songs" | "tags" | "custom_collections" | StoreWithParent | "scriptures";

export type StoreWithParent = "chapters" | "books" | "translations";

type Entry<S extends Store> = StoreTypes[S];

// const parentMapping: {
//     [key: string]: string;
// } = {
//     translations: "scriptureid",
//     books: "bookid",
//     chapters: "chapterid",
// };

class ModuleCache {
    private dbName = "hiddentreasures";
    private stores: Store[] = [
        "songs",
        "tags",
        "custom_collections",
        "translations",
        "chapters",
        "books",
        "scriptures",
    ];
    // Only update if you need to clear cache for everyone or a new store is added.
    private version = 29;

    private db() {
        const v = this.version;
        const stores = this.stores;
        return openDB(this.dbName, v, {
            upgrade(db) {
                for (const store of stores) {
                    if (db.objectStoreNames.contains(store)) {
                        db.deleteObjectStore(store);
                        db.createObjectStore(store);
                    }
                    if (!db.objectStoreNames.contains(store)) {     
                        db.createObjectStore(store);
                    }
                }
            },
        });
    }

    public async clearCache() {
        for (const store of this.stores) {
            const tx = await this.tx(store, true);

            await tx.objectStore(store).clear?.();

            await tx.done;
        }
    }

    private async tx(store: Store, write = false) {
        return (await this.db()).transaction(store, write ? "readwrite" : "readonly");
    }

    private async _get<S extends Store>(store: S, key: string) {
        return await (await this.tx(store)).objectStore(store).get(key) as EntryWithExpiry<Entry<S>>;
    }

    private async _set<S extends Store>(store: S, key: string, value: EntryWithExpiry<Entry<S>>) {
        await (await this.tx(store)).objectStore(store).put?.(value, key);
    }

    public async clearStore(store: Store) {
        await (await this.tx(store, true)).objectStore(store).clear?.();
    }

    public async set<S extends Store>(store: S, key: string, value: Entry<S>, expiration = 60) {
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + expiration);
        
        const entry: EntryWithExpiry<Entry<S>> = {
            entry: value,
            expiry,
        };

        await this._set(store, key, entry);
    }

    public async get<S extends Store>(store: S, key: string) {
        const entry = await this._get(store, key);
        return entry.expiry > new Date() ? entry.entry : undefined;
    }

    public async remove<S extends Store>(store: S, key: string) {
        const tx = await this.tx(store, true);
        await tx.objectStore(store).delete?.(key);
    }

    public async getOrCreate<S extends Store>(store: S, key: string, factory: () => Promise<Entry<S>>, expiry = 60): Promise<Entry<S>> {
        const nowDate = new Date();

        let result = (await (await this.tx(store, false)).objectStore(store).get(key)) as EntryWithExpiry<Entry<S>> | undefined;

        if (!result || (result.expiry < nowDate)) {
            const expireDate = new Date();
            expireDate.setSeconds(nowDate.getSeconds() + expiry);

            result = {
                expiry: expireDate,
                entry: await factory(),
            };

            await (await this.tx(store, true)).objectStore(store).put?.(result, key);
        }

        return result.entry;
    }

    public async getOrRetrieve<S extends Store>(store: S, key: string, factory: () => Promise<Entry<S>>) {
        return await this.get(store, key) ?? await factory();
    }
}

export default new ModuleCache();

