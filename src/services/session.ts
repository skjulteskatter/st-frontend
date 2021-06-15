import { Collection, Song } from "@/classes";
import { Tag } from "@/classes/tag";
import { ApiSong, MediaFile, ShareKey } from "dmb-api";
import { analytics, items, sharing, songs, tags } from "./api";
import { cache } from "./cache";
import { notify } from "./notify";

export class Session {
    private _initialized?: boolean;
    public songs: Song[] = [];
    public collections: Collection[] = [];
    public files: MediaFile[] = [];

    public themes: Theme[] = [];
    public tags: Tag[] = [];
    public countries: Country[] = [];
    public copyrights: Copyright[] = [];
    public languages: Language[] = [];

    public get initialized() {
        return this._initialized == true;
    }

    public async init() {
        if (this._initialized == false) {
            while(this._initialized == false) {
                await new Promise(r => setTimeout(r, 100));
            }
            return;
        }

        this._initialized = false;
        this.collections = (await songs.getCollections()).map(c => new Collection(c));

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
                    if (updateSongs.result.length > 0)
                        await cache.set("config", key, new Date(updateSongs.lastUpdated).toISOString());
                }
            } catch(e) {
                notify("error", "Error fetching files", "warning", e);
                this.files = (await songs.getFiles(ownedCols)).result;
            }

            this.files = this.files.length > 0 ? this.files : (await cache.getAll("files"));
            try {
                const key = "last_updated_songs";
                const lastUpdated = await cache.get("config", key) as string | undefined;

                const now = new Date();

                if (lastUpdated == undefined || (now.getTime() - new Date(lastUpdated).getTime()) > 86400000) {
                    const updateSongs = await songs.getAllSongs(ownedCols, lastUpdated);

                    await cache.replaceEntries("songs", updateSongs.result.reduce((a, b) => {
                        a[b.id] = b;
                        return a;
                    }, {} as {
                        [id: string]: ApiSong;
                    }));

                    if (updateSongs.result.length > 0)
                        await cache.set("config", key, new Date(updateSongs.lastUpdated).toISOString());
                }
            }
            catch(e) {
                notify("error", "Error occured", "warning", e);
                this.songs = (await songs.getAllSongs(ownedCols)).result.map(s => new Song(s));
            }
            
            this.songs = this.songs.length > 0 ? this.songs : (await cache.getAll("songs")).map(s => new Song(s));
        }

        items.getCountries().then(c => {
            this.countries = c;
        }).catch();
        items.getThemes().then(t => {
            this.themes = t;
        }).catch();

        items.getCopyrights().then(c => {
            this.copyrights = c;
        }).catch();

        items.getTags().then(t => {
            this.tags = t.map(i => new Tag(i, false));
            tags.getAll().then(ts => {
                for (const tag of ts) {
                    for (const sId of tag.songIds) {
                        const song = this.songs.find(s => s.id == sId);
                        song?.tagIds.push(tag.id);
                    }
                }
                this.tags = [...this.tags, ...ts.map(i => new Tag(i, true))];
            });
        }).catch();

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
