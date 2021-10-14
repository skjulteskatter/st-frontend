import { favorites } from "@/services/api";
import { cache } from "@/services/cache";

const expiry = () => new Date().getTime() + 60000;

export default class Favorites {
    private favorites: string[] | null = null;

    public async init() {
        if (this.favorites === null) {
            this.favorites = await cache.getOrCreateAsync("favorites", () => favorites.get(), expiry());
        }
    }

    private save() {
        cache.set("general", "favorites", {
            expiry: expiry(),
            item: JSON.stringify(this.favorites),
        });
    }

    public async add(songIds: string[]) {
        if (songIds.some(i => this.favorites?.includes(i) === true)) {
            throw new Error("Cannot add songs which are already there.");
        }
        await favorites.add(songIds);
        this.favorites?.push(...songIds);

        this.save();
    }

    public async delete(songIds: string[]) {
        if (!songIds.every(i => this.favorites?.includes(i) === true)) {
            throw new Error("Trying to remove songs that aren't found");
        }
        await favorites.delete(songIds);

        for (const id of songIds) {
            this.favorites?.splice(this.favorites.indexOf(id), 1);
        }

        this.save();
    }
}
