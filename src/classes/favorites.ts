import { favorites as api } from "@/services/api";
import { cache } from "@/services/cache";

export default class Favorites {
    private expiry = () => new Date().getTime() + 60000;
    private favorites: string[] | null = null;
    private _loading = false;

    public get loading() {
        return this._loading === true;
    }

    public async init() {
        if (this.favorites === null) {
            this.favorites = await cache.getOrCreateAsync("favorites", () => api.get(), this.expiry());
        }
    }

    private save() {
        cache.set("general", "favorites", {
            expiry: this.expiry(),
            item: JSON.stringify(this.favorites),
        });
    }

    private run<T>(func: () => Promise<T>) {
        this._loading = true;
        try {
            return func();
        }
        finally {
            this._loading = false;
        }
    }

    public add(songIds: string[]) {
        return this.run(async () => {
            if (songIds.some(i => this.favorites?.includes(i) === true)) {
                throw new Error("Cannot add songs which are already there.");
            }
            await api.add(songIds);
            this.favorites?.push(...songIds);
    
            this.save();
        });
    }

    public remove(songIds: string[]) {
        return this.run(async () => {
            if (!songIds.every(i => this.favorites?.includes(i) === true)) {
                throw new Error("Trying to remove songs that aren't found");
            }
            await api.delete(songIds);
    
            for (const id of songIds) {
                this.favorites?.splice(this.favorites.indexOf(id), 1);
            }
    
            this.save();
        });
    }

    public has(id?: string) {
        return id !== undefined && this.favorites?.includes(id) === true;
    }

    public async toggle(id?: string) {
        if (!id) return;
        if (!this.has(id)) {
            await this.add([id]);
        } else {
            await this.remove([id]);
        }
    }
}
