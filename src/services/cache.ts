import { Lyrics } from "@/classes";
import { ICollectionItem, ApiContributor, ICustomCollection, ISong, ITag, MediaFile, IChapter, IBook, ITranslation, IScripture } from "songtreasures";
import { openDB } from "idb";
import { Notification } from "songtreasures";

type EntryWithExpiry<T> = {
    expiry: Date;
    entry: T;
}

type StoreTypes = {
    songs: ISong;
    contributors: ICollectionItem<ApiContributor>;
    lyrics: Lyrics;
    config: string | string[] | number | boolean | Date | undefined;
    items: {
        id: string;
        value: unknown;
    };
    files: MediaFile;
    notifications: Notification;
    general: {
        expiry: number;
        item: string;
    };
    tags: ITag;
    custom_collections: ICustomCollection;
    chapters: IChapter;
    books: IBook;
    translations: ITranslation;
    scriptures: IScripture;
}

type Store = "songs" | "contributors" | "lyrics" | "config" | "items" | "files" | "notifications" | "general"
 | "tags" | "custom_collections" | StoreWithExpiry;

export type StoreWithExpiry = "chapters" | "books" | "translations" | "scriptures";

export type StoreWithParent = "chapters" | "books" | "translations";

type Entry<S extends Store> = StoreTypes[S];

const parentMapping: {
    [key: string]: string;
} = {
    translations: "scriptureid",
    books: "bookid",
    chapters: "chapterid",
};

class CacheService {
    private dbName = "songtreasures";
    private stores: Store[] = [
        "songs",
        "contributors",
        "lyrics",
        "config",
        "items",
        "files",
        "notifications",
        "general",
        "tags",
        "custom_collections",
        "translations",
        "chapters",
        "books",
        "scriptures",
    ];
    // Only update if you need to clear cache for everyone or a new store is added.
    private version = 30;

    private db() {
        const v = this.version;
        const stores = this.stores;
        return openDB(this.dbName, v, {
            upgrade(db) {
                for (const store of stores) {
                    // if (["config", "lyrics"].includes(store) && db.objectStoreNames.contains(store)) {
                    //     db.deleteObjectStore(store);
                    //     db.createObjectStore(store);
                    // }
                    let objectStore;
                    if (db.objectStoreNames.contains(store)) {
                        db.deleteObjectStore(store);
                        objectStore = db.createObjectStore(store);
                    }
                    if (!db.objectStoreNames.contains(store)) {     
                        objectStore = db.createObjectStore(store);
                    }

                    if (["translations", "chapters", "books"].includes(store)) {
                        objectStore?.createIndex("parentid", parentMapping[store], {unique: false});
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

    public async clearStore(store: Store) {
        await (await this.tx(store, true)).objectStore(store).clear?.();
    }

    public async set<S extends Store>(store: S, key: string, value: Entry<S>): Promise<void> {
        const tx = await this.tx(store, true);
        
        await tx.objectStore(store).put?.(value, key);

        await tx.done;
    }

    public async get<S extends Store>(store: S, key: string): Promise<Entry<S> | undefined> {
        const tx = await this.tx(store);

        const result = await tx.objectStore(store).get(key);
        
        await tx.done;

        return result as Entry<S>;
    }

    public async delete<S extends Store>(store: S, key: string): Promise<void> {
        const tx = await this.tx(store, true);
        await tx.objectStore(store).delete?.(key);
    }

    public async getAll<S extends Store>(store: S): Promise<Entry<S>[]> {
        const tx = await this.tx(store);

        const result = await tx.store.getAll();

        await tx.done;

        return result as Entry<S>[];
    }

    public async setAll<S extends Store>(store: S, entries: Entry<S>[]): Promise<void> {
        const tx = await this.tx(store, true);

        for (const e of entries) {
            let key = (e as {
                id: string;
            }).id;

            if (e instanceof Lyrics) {
                key = e.id + "_" + e.languageKey;
            }

            await tx.objectStore(store).add?.(e, key);
        }

        await tx.done;
    }

    public async replaceEntries<S extends Store>(store: S, entries: {
        [id: string]: Entry<S>;
    }) {
        const tx = await this.tx(store, true);

        for (const [key, value] of Object.entries(entries)) {
            await tx.objectStore(store).put?.(value, key);
        }

        await tx.done;
    }

    public async getOrCreateAsync<T>(key: string, factory: () => Promise<T>, expiry: number) {
        try {
            const tx = await this.tx("general", true);

            const r = (await tx.objectStore("general").get?.(key)) as Entry<"general"> | null;
    
            await tx.done;
    
            if (r && r.expiry > new Date().getTime()) {
                return JSON.parse(r.item) as T;
            }
    
            try {
                const item = await factory();
        
                await this.set("general", key, {
                    expiry,
                    item: JSON.stringify(item),
                });
        
                return item;
            }
            catch {
                return null;
            }
        } catch {
            return await factory();
        }
    }

    public async getOrCreateHashAsync<S extends Store>(module: S, factory: () => Promise<{[key: string]: Entry<S>}>, expiration: number): Promise<Entry<S>[]> {
        try {
            const expiry = await this.get("config", module + "_expiry") as number | undefined;

            if (!expiry || new Date(expiry).getTime() < new Date().getTime()) {
                (await this.tx(module, true)).store.clear?.();

                const items = await factory();

                for (const i of Object.entries(items)) {
                    await this.set(module, i[0], i[1]);
                }

                await this.set("config", module + "_expiry", expiration);

                return Object.values(items);
            }

            return await (await this.tx(module)).store.getAll() as Entry<S>[];
        }
        catch {
            return Object.values(await factory());
        }
    }

    /**
     * 
     * @param store 
     * @param key 
     * @param factory 
     * @param expiry Expiry in seconds
     */
    public async getOrCreate<S extends StoreWithExpiry>(store: S, key: string, factory: () => Promise<Entry<S>>, expiry = 60): Promise<Entry<S>> {
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
}

const cache = new CacheService();

export {
    cache,
};
