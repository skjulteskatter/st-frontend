import { Collection, CollectionItem, Lyrics, Song } from "@/classes";
import { Category } from "@/classes/category";
import { Genre, Theme, Country, Copyright } from "@/classes/items";
import { Tag } from "@/classes/tag";
import { User } from "@/classes/user";
import { ApiCollectionItem, ApiContributor, ApiCustomCollection, ApiSong, ApiTag, MediaFile, ShareKey } from "dmb-api";
import { analytics, favorites, items, playlists, session, sharing, songs, tags } from "./api";
import { analytics as googleAnalytics } from "./auth";
import { cache } from "./cache";
import { notify } from "./notify";

export class Session {
    private _initialized?: boolean;

    private _user?: User;

    public get user() {
        if (!this._user) {
            throw new Error("User isn't set");
        }
        return this._user;
    }

    public set user(v) {
        this._user = v;
    }

    public songs: Song[] = [];
    public collections: Collection[] = [];
    public files: MediaFile[] = [];
    public contributors: CollectionItem<ApiContributor>[] = [];

    public themes: Theme[] = [];
    public categories: Category[] = [];
    public tags: Tag[] = [];
    public customCollections: ApiCustomCollection[] = [];
    public countries: Country[] = [];
    public genres: Genre[] = [];
    public copyrights: Copyright[] = [];
    public languages: Language[] = [];
    public favorites: string[] = [];

    public lyrics: Lyrics[] = [];

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
        if (this.initialized)
            return;


        const user = await cache.getOrCreateAsync("user", session.getCurrentUser, new Date().getTime() + 10000);
        
        if (!user) {
            throw new Error("User not authenticated");
        }

        this.user = new User(user);
        googleAnalytics.setUserId(this.user.id);

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
        
        const fetchSongs = async () => {
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
        };
        
        const fetchFiles = async () => {
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
        };
        
        const fetchContributors = async () => {
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
        };

        const fetchAll = [fetchContributors()];

        fetchAll.push(fetchSongs(), fetchFiles());

        const expiry = new Date().getTime() + 3600000;

        for (const f of [
            async () => {
                this.countries = (await cache.getOrCreateAsync("countries", items.getCountries, expiry) ?? []).map(i => new Country(i));
            },
            async () => {
                this.copyrights = (await cache.getOrCreateAsync("copyrights", items.getCopyrights, expiry) ?? []).map(i => new Copyright(i));
            },
            async () => {
                this.themes = (await cache.getOrCreateAsync("themes", items.getThemes, expiry) ?? []).map(i => new Theme(i));
            },
            async () => {
                this.genres = (await cache.getOrCreateAsync("genres", items.getGenres, expiry) ?? []).map(i => new Genre(i));
            },
            async () => {
                this.categories = (await cache.getOrCreateAsync("categories", items.getCategories, expiry) ?? []).map(i => new Category(i));
            },
            async () => {
                this.languages = (await cache.getOrCreateAsync("languages", items.getLanguages, expiry)) ?? [];
            },
            async () => {
                const obj: {
                    [key: string]: ApiTag;
                } = {};
                const getTags = async () => (await tags.getAll()).reduce((a, b) => {a[b.id] = b; return a;}, obj);
                this.tags = (await cache.getOrCreateHashAsync("tags", getTags, new Date().getTime() + 60000)).map(i => new Tag(i)) ?? [];
            },
            async () => {
                const obj: {
                    [key: string]: ApiCustomCollection;
                } = {};
                const getCustomCollections = async () => (await playlists.getPlaylists()).reduce((a, b) => {a[b.id] = b; return a;}, obj);
                this.customCollections = (await cache.getOrCreateHashAsync("custom_collections", getCustomCollections, expiry) ?? []);
            },
            async () => {
                this.favorites = (await cache.getOrCreateAsync("favorites", favorites.getFavorites, expiry)) ?? [];
            },
        ]) {
            fetchAll.push(f());
        }

        await Promise.all(fetchAll);

        await this.getViews();

        try {
            const key = "lyrics_expiry";
            const expiry = await cache.get("config", key) as number | undefined;

            if (!expiry || new Date(expiry).getTime() < new Date().getTime()) {
                await cache.clearStore("lyrics");

                await cache.set("config", key, new Date().getTime() + 86400000);
            } else {
                this.lyrics = (await cache.getAll("lyrics")).map(i => new Lyrics(i));
            }
        }
        catch {
            // ignore the errors
        }


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
