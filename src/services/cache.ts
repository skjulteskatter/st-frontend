import { Lyrics } from "@/classes";
import { ApiCollectionItem, ApiContributor, ApiSong, MediaFile } from "dmb-api";
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
}

type Store = "songs" | "contributors" | "lyrics" | "config" | "items" | "files" | "notifications";

type Entry<S extends Store> = StoreTypes[S];

class CacheService {
    private dbName = "songtreasures";
    private stores: Store[] = [
        "songs",
        "contributors",
        "lyrics",
        "config",
        "items",
        "notifications",
    ];
    private version = 15;

    public db() {
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

    public clearCache() {
        this.tx("config", true).then(db => {
            db.objectStore("config").clear?.().then(() => {
                window.location.reload();
            });
        });
    }

    private async tx(store: Store, write = false) {
        return (await this.db()).transaction(store, write ? "readwrite" : "readonly");
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

        const result = await tx.objectStore(store).getAll();

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
}

const cache = new CacheService();

export {
    cache,
};
