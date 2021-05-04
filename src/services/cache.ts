import { Lyrics, Song } from "@/classes";
import { ApiContributorCollectionItem } from "dmb-api";
import { openDB } from "idb";

type StoreTypes = {
    songs: Song;
    contributors: ApiContributorCollectionItem;
    lyrics: Lyrics;
    config: {
        id: string;
        value: string | number | boolean | undefined;
    };
    items: {
        id: string;
        value: unknown;
    };
}

type Store = "songs" | "contributors" | "lyrics" | "config" | "items";

type Entry<S extends Store> = StoreTypes[S];

class CacheService {
    private dbName = "songtreasures";
    private stores: Store[] = [
        "songs",
        "contributors",
        "lyrics",
        "config",
        "items",
    ];
    private version = 11;

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

    public async getAll<S extends Store>(store: S): Promise<Entry<S>[]> {
        const tx = await this.tx(store);

        const result = await tx.objectStore(store).getAll();

        await tx.done;

        if (store == "songs") {
            return result.map(s => new Song(s)) as Entry<S>[];
        } else if (store == "lyrics") {
            return result.map(l => new Lyrics(l)) as Entry<S>[];
        } else if (store == "contributors") {
            return result as Entry<S>[];
        }
        return result;
    }

    public async setAll<S extends Store>(store: S, entries: Entry<S>[]): Promise<void> {
        const tx = await this.tx(store);

        for (const e of entries) {
            let key = e.id;

            if (e instanceof Lyrics) {
                key = e.id + "_" + e.language.key;
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
