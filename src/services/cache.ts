import { Lyrics } from "@/classes";
import { ICollectionItem, ApiContributor, ICustomCollection, ISong, ITag, IMediaFile, IChapter, IBook, ITranslation } from "songtreasures-api";
import { openDB } from "idb";
import { Notification } from "songtreasures-api";

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
    files: IMediaFile;
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
}

type Store = "songs" | "contributors" | "lyrics" | "config" | "items" | "files" | "notifications" | "general"
 | "tags" | "custom_collections" | StoreWithParent;

export type StoreWithParent = "chapters" | "books" | "translations";

type Entry<S extends Store> = StoreTypes[S];

// const parentMapping: {
//     [key: string]: string;
// } = {
//     translations: "scriptureid",
//     books: "bookid",
//     chapters: "chapterid",
// };

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
    ];
    // Only update if you need to clear cache for everyone or a new store is added.
    private version = 38;

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
                    if (db.objectStoreNames.contains(store)) {
                        db.deleteObjectStore(store);
                        db.createObjectStore(store);
                    }
                    if (!db.objectStoreNames.contains(store)) {     
                        db.createObjectStore(store);
                    }

                    // if (["translations", "chapters", "books"].includes(store)) {
                    //     objectStore?.createIndex("parentid", parentMapping[store], {unique: false});
                    // }
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
        // avoid
    }

    public async get<S extends Store>(store: S, key: string): Promise<Entry<S> | undefined> {
        return undefined
    }

    public async delete<S extends Store>(store: S, key: string): Promise<void> {
        // void
    }

    public async getAll<S extends Store>(store: S): Promise<Entry<S>[]> {
        return []
    }

    public async setAll<S extends Store>(store: S, entries: Entry<S>[]): Promise<void> {
        // void
    }

    public async replaceEntries<S extends Store>(store: S, entries: {
        [id: string]: Entry<S>;
    }) {
        // void
    }

    public async getOrCreateAsync<T>(key: string, factory: () => Promise<T>, expiry: number) {
        return await factory()
    }

    public async getOrCreateHashAsync<S extends Store>(module: S, factory: () => Promise<{[key: string]: Entry<S>}>, expiration: number): Promise<Entry<S>[]> {
        return Object.values(await factory())
    }

    /**
     * 
     * @param store 
     * @param key 
     * @param factory 
     * @param expiry Expiry in seconds
     */
    public async getOrCreate<S extends StoreWithParent>(store: S, key: string, factory: () => Promise<Entry<S>>, expiry = 60): Promise<Entry<S>> {
        return factory()
    }
}

const cache = new CacheService();

export {
    cache,
};
