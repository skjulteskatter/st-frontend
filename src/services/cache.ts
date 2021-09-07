import { Lyrics } from "@/classes";
import { ApiCollectionItem, ApiContributor, ApiPlaylist, ApiSong, ApiTag, MediaFile } from "dmb-api";
import { openDB } from "idb";
import { Notification } from "songtreasures";

type StoreTypes = {
    songs: ApiSong;
    contributors: ApiCollectionItem<ApiContributor>;
    lyrics: Lyrics;
    config: string | number | boolean | undefined;
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
    tags: ApiTag;
    custom_collections: ApiPlaylist;
}

type Store = "songs" | "contributors" | "lyrics" | "config" | "items" | "files" | "notifications" | "general" | "tags" | "custom_collections";

type Entry<S extends Store> = StoreTypes[S];

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
    ];
    private version = 25;

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
                }
            },
        });
    }

    public async clearCache() {
        for (const store of this.stores) {
            const tx = await this.tx(store, true);

            await tx.objectStore(store).clear?.();
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

    public async get<S extends Store>(store: S, key: string): Promise<Entry<S>> {
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
        if (store == "lyrics") {
            return result.map(l => new Lyrics(l)) as Entry<S>[];
        } else if (store == "contributors") {
            return result as Entry<S>[];
        }
        return result;
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

            const tx = await this.tx(module, true);

            if (!expiry || new Date(expiry).getTime() < new Date().getTime()) {
                tx.store.clear?.();

                const items = await factory();

                for (const i of Object.entries(items)) {
                    await tx.store.put?.(i[1], i[0]);
                }

                await this.set("config", module + "_expiry", expiration);

                return Object.values(items);
            }

            return await tx.store.getAll() as Entry<S>[];
        }
        catch {
            return Object.values(await factory());
        }
    }
}

const cache = new CacheService();

export {
    cache,
};
