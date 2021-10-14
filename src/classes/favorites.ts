import { favorites as api } from "@/services/api";
import { cache } from "@/services/cache";

export default class Favorites {
    private expiry = () => new Date().getTime() + 60000;
    private favorites: string[] | null = null;

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

    public async add(songIds: string[]) {
        if (songIds.some(i => this.favorites?.includes(i) === true)) {
            throw new Error("Cannot add songs which are already there.");
        }
        await api.add(songIds);
        this.favorites?.push(...songIds);

        this.save();
    }

    public async delete(songIds: string[]) {
        if (!songIds.every(i => this.favorites?.includes(i) === true)) {
            throw new Error("Trying to remove songs that aren't found");
        }
        await api.delete(songIds);

        for (const id of songIds) {
            this.favorites?.splice(this.favorites.indexOf(id), 1);
        }

        this.save();
    }
}
