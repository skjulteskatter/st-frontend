import { Collection, CollectionItem, Song } from "@/classes";
import { Category } from "@/classes/category";
import { Genre, Theme, Country, Copyright } from "@/classes/items";
import { Tag } from "@/classes/tag";
import { ApiCollectionItem, ApiContributor, ApiSong, MediaFile, ShareKey } from "dmb-api";
import { analytics, items, sharing, songs, tags } from "./api";
import { cache } from "./cache";
import { notify } from "./notify";

export class Session {
    private _initialized?: boolean;
    public songs: Song[] = [];
    public collections: Collection[] = [];
    public files: MediaFile[] = [];
    public contributors: CollectionItem<ApiContributor>[] = [];

    public themes: Theme[] = [];
    public categories: Category[] = [];
    public tags: Tag[] = [];
    public countries: Country[] = [];
    public genres: Genre[] = [];
    public copyrights: Copyright[] = [];
    public languages: Language[] = [];

    public get Tags() {
        return this.tags;
    }

    public get initialized() {
        return this._initialized === true;
    }

    public async init() {
        if (this._initialized === false) {
            while(this._initialized === false) {
                await new Promise(r => setTimeout(r, 100));
            }
            return;
        }

        this._initialized = false;
        this.collections = (await cache.getOrCreateAsync("collections", songs.getCollections, new Date().getTime() + 60000) ?? []).map(c => new Collection(c));

        const lastCacheClear = await cache.get("config", "last_cache_clear") as number | undefined;

        if (!lastCacheClear || lastCacheClear < (new Date().getTime() - 86400000)) {
            await cache.clearCache();

            await cache.set("config", "last_cache_clear", new Date().getTime());
        }

        const ownedCols = this.collections.filter(c => c.available).map(c => c.id);

        const previousCols = await cache.get("config", "owned_collections");

        if (previousCols) {
            const fetchSongs = ownedCols.filter(c => !(JSON.parse(previousCols as string) as string[]).some(i => i == c));
            
            if (fetchSongs.length) {
                const s = await songs.getAllSongs(fetchSongs);

                await cache.replaceEntries("songs", s.result.reduce((a, b) => {
                    a[b.id] = b;
                    return a;
                }, {} as {
                    [id: string]: ApiSong;
                }));

                const f = await songs.getFiles(fetchSongs);

                await cache.replaceEntries("files", f.result.reduce((a, b) => {
                    a[b.id] = b;
                    return a;
                }, {} as {
                    [id: string]: MediaFile;
                }));

                const c = await songs.getContributors();

                await cache.replaceEntries("contributors", c.result.reduce((a, b) => {
                    a[b.id] = b;
                    return a;
                }, {} as {
                    [id: string]: ApiCollectionItem<ApiContributor>;
                }));
            }
        }

        await cache.set("config", "owned_collections", JSON.stringify(ownedCols));
        
        if (ownedCols.length) {
            try {
                const key = "last_updated_files";
                const lastUpdated = await cache.get("config", key) as string | undefined;

                const now = new Date();

                if (lastUpdated == undefined || (now.getTime() - new Date(lastUpdated).getTime()) > 3600000) {
                    const updateSongs = await songs.getFiles(ownedCols, lastUpdated);

                    await cache.replaceEntries("files", updateSongs.result.reduce((a, b) => {
                        a[b.id] = b;
                        return a;
                    }, {} as {
                        [id: string]: MediaFile;
                    }));
                    
                    await cache.set("config", key, new Date(updateSongs.lastUpdated).toISOString());
                }
            } catch(e) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error = e as any;
                notify("error", "Error fetching files", "warning", error);
                this.files = (await songs.getFiles(ownedCols)).result;
            }

            this.files = this.files.length > 0 ? this.files : (await cache.getAll("files"));
            try {
                const key = "last_updated_songs";
                const lastUpdated = await cache.get("config", key) as string | undefined;

                const now = new Date();

                if (lastUpdated == undefined || (now.getTime() - new Date(lastUpdated).getTime()) > 3600000) {
                    const updateSongs = await songs.getAllSongs(ownedCols, lastUpdated);

                    await cache.replaceEntries("songs", updateSongs.result.reduce((a, b) => {
                        a[b.id] = b;
                        return a;
                    }, {} as {
                        [id: string]: ApiSong;
                    }));

                    await cache.set("config", key, new Date(updateSongs.lastUpdated).toISOString());
                }
            }
            catch(e) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error = e as any;
                notify("error", "Error occured", "warning", error);
                this.songs = (await songs.getAllSongs(ownedCols)).result.map(s => new Song(s));
            }
            
            this.songs = this.songs.length > 0 ? this.songs : (await cache.getAll("songs")).map(s => new Song(s));

        }
        
        try {
            const key = "last_updated_contributors";
            const lastUpdated = await cache.get("config", key) as string | undefined;

            const now = new Date();

            if (lastUpdated == undefined || (now.getTime() - new Date(lastUpdated).getTime()) > 3600000) {
                const updateItems = await songs.getContributors(lastUpdated);

                await cache.replaceEntries("contributors", updateItems.result.reduce((a, b) => {
                    a[b.id] = b;
                    return a;
                }, {} as {
                    [id: string]: ApiCollectionItem<ApiContributor>;
                }));

                await cache.set("config", key, new Date(updateItems.lastUpdated).toISOString());
            }
        }
        catch(e) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const error = e as any;
            notify("error", "Error occured", "warning", error);
            this.contributors = (await songs.getContributors()).result.map(s => new CollectionItem<ApiContributor>(s));
        }

        this.contributors = (this.contributors.length > 0 ? this.contributors : (await cache.getAll("contributors")).map(s => new CollectionItem<ApiContributor>(s))).sort((a, b) => a.item.name > b.item.name ? 1 : -1);

        const expiry = new Date().getTime() + 3600000;
        
        this.countries = (await cache.getOrCreateAsync("countries", items.getCountries, expiry) ?? []).map(i => new Country(i));
        this.themes = (await cache.getOrCreateAsync("themes", items.getThemes, expiry) ?? []).map(i => new Theme(i));
        this.copyrights = (await cache.getOrCreateAsync("copyrights", items.getCopyrights, expiry) ?? []).map(i => new Copyright(i));
        this.genres = (await cache.getOrCreateAsync("genres", items.getGenres, expiry) ?? []).map(i => new Genre(i));
        this.categories = (await cache.getOrCreateAsync("categories", items.getCategories, expiry) ?? []).map(i => new Category(i));

        const ts = await cache.getOrCreateAsync("user_tags", tags.getAll, new Date().getTime() + 60000) ?? [];
        for (const tag of ts) {
            for (const sId of tag.songIds) {
                const song = this.songs.find(s => s.id == sId);
                song?.tagIds.push(tag.id);
            }
        }
        this.tags = ts.map(i => new Tag(i));

        this.languages = await items.getLanguages();

        await this.getViews();

        this._initialized = true;
    }

    private views?: {
        [key: string]: number;
    };

    public get Views() {
        return this.views ?? {};
    }

    private lastUpdated?: Date;

    public async getViews() {
        if (this.views) {
            const date = new Date();
            date.setSeconds(date.getSeconds() - 10);
            
            if (this.lastUpdated && this.lastUpdated < date) {
                analytics.getTotalViews().then(r => {
                    this.views = r;
                });
            }

            return this.views;
        }
        try {
            this.views = await analytics.getTotalViews();
        }
        catch {
            this.views = {};
        }
    }

    private keys?: ShareKey[];

    public get Keys() {
        return this.keys ?? [];
    }

    public addKey(key: ShareKey) {
        this.keys = [...this.keys ?? [], key];
    }

    public async getKeys() {
        if (this.keys) return this.Keys;

        try {
            this.keys = await sharing.getKeys();
        }
        catch {
            this.keys = [];
        }
        return this.Keys;
    }
}

export const appSession = new Session();
