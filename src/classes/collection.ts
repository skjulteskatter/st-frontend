import api from "@/services/api";
import { ICollection, ApiContributor, Sort } from "songtreasures-api";
import { ListEntry, Lyrics, Song, CollectionItem } from ".";
import BaseClass from "./baseClass";
import { cache } from "@/services/cache";
import { notify } from "@/services/notify";
import { appSession } from "@/services/session";
import router from "@/router";
import SongFilter from "./songFilter";
import LocaleString from "./localeString";
import { ILocaleString, Origin } from "songtreasures";
import { storeService } from "@/services/modules";

type CollectionSettings = {
    offline: boolean;
    lastSynced?: string;
}

export default class Collection extends BaseClass implements ICollection {
    public id;
    public enabled;
    public type;
    public priority;
    public freeSongs;
    public keys;
    public defaultType;

    private _defaultSort: Sort;

    public get defaultSort(): Sort {
        if (this._defaultSort == "author") 
            if (this.hasAuthors)
                return "author";
            else 
                return "title";
        if (this._defaultSort == "composer") 
            if (this.hasAuthors)
                return "composer";
            else 
                return "title";

        return this._defaultSort;
    }

    private _available?: boolean;

    public get available() {
        return this._available == true;    
    }

    public details?: ILocaleString;
    public hasChords: {
        [lang: string]: boolean;
    };

    public image: string;

    public settings?: CollectionSettings;

    private _initialized = false;
    private _loading = false;

    public songs: Song[] = [];
    public lyrics: Lyrics[] = [];
    
    public hasAuthors = false;
    public hasComposers = false;
    public hasCountries = false;
    public hasThemes = false;
    public hasCategories = false;
    public hasGenres = false;

    public contributors: CollectionItem<ApiContributor>[] = [];

    public listType: Sort;
    public viewType: "boards" | "grid" = "boards";

    public buttons: {
        label: string;
        value: string;
        selected: () => boolean;
    }[] = [];

    constructor(collection: ICollection) {
        super();
        this.enabled = collection.enabled;
        this.type = collection.type;
        this.priority = collection.priority;
        this.freeSongs = collection.freeSongs;
        this.keys = new LocaleString(collection.keys ?? {});
        this.defaultType = collection.defaultType;
        this._defaultSort = collection.defaultSort;
        this.listType = this.defaultSort;
        this.id = collection.id;
        this.name = new LocaleString(collection.name ?? {});
        this.image = collection.image;
        this._available = collection.available;
        this.details = collection.details;
        this.hasChords = collection.hasChords ?? {};
        cache.get("config", "collection_" + this.id).then((r) => {
            this.settings = JSON.parse(r as string | undefined ?? "{\"offline\": false}") as CollectionSettings;
        });
    }

    public get key() {
        return this.keys.default;
    }

    public getKeys() {
        const keys = Object.entries(this.keys).map(e => e[1]);
        return keys.length ? keys : [this.key];
    }

    public async setSettings(settings: CollectionSettings) {
        this.settings = settings;
        await cache.set("config", "collection_" + this.id, JSON.stringify(settings));
    }

    private async initialize() {
        if (!this._initialized) {
            this._initialized = true;

            await new Promise(r => setTimeout(r, 10));

            await appSession.init();

            this.songs = appSession.songs.filter(s => s.collectionIds.some(c => this.id == c)).sort((a, b) => a.getNumber(this.id) - b.getNumber(this.id));

            this.hasAuthors = this.hasAuthors || this.songs.some(s => s.participants.some(p => p.type == "author"));
            this.hasComposers = this.hasComposers || this.songs.some(s => s.participants.some(p => p.type == "composer"));
            this.hasThemes = this.hasThemes || this.songs.some(s => s.themeIds.length > 0);
            this.hasCountries = this.hasCountries || this.songs.some(s => s.origins.some(o => o.type == "text"));
            this.hasCategories = this.hasCategories || this.songs.some(s => s.categoryIds.length > 0);
            this.hasGenres = this.hasGenres || this.songs.some(s => s.genreIds.length > 0);

            this.buttons = [
                {
                    label: "common_number",
                    value: "number",
                    selected: () => this.listType == "number",
                },
                {
                    label: "common_title",
                    value: "title",
                    selected: () => this.listType == "title",
                },
                {
                    label: "song_author",
                    value: "author",
                    selected: () => this.listType == "author",
                    hidden: !this.hasAuthors,
                },
                {
                    label: "song_composer",
                    value: "composer",
                    selected: () => this.listType == "composer",
                    hidden: !this.hasComposers,
                },
                {
                    label: "song_genre",
                    value: "genre",
                    selected: () => this.listType == "genre",
                    hidden: !this.hasGenres,
                },
                {
                    label: "song_category",
                    value: "categories",
                    selected: () => this.listType == "categories",
                    hidden: !this.hasCategories,
                },
                {
                    label: "common_views",
                    value: "views",
                    selected: () => this.listType == "views",
                    hidden: !appSession.user.roles.includes("administrator"),
                },
            ].filter(
                (b) =>
                    b.hidden != true,
            );

            this.contributors = appSession.contributors.filter(i => this.songs.some(s => i.songIds.includes(s.id)));
        }
    }
    
    public async load(language: string) {
        if (this._loading) return;
        this._loading = true;
        await this.initialize();

        if (this.settings?.offline) {
            if (navigator.onLine) {
                try {
                    const key = "lyrics_lastUpdated_" + this.id + "_" + language;
                    const lastUpdated = await cache.get("config", key) as string | undefined;
                    const updateLyrics = await api.songs.getAllLyrics(this, language, "json", 0, lastUpdated);

                    await cache.replaceEntries("lyrics", updateLyrics.reduce((a, b) => {
                        a[b.id] = b;
                        return a;
                    }, {} as {
                        [id: string]: Lyrics;
                    }));

                    const now = new Date();

                    await cache.set("config", key, new Date(now.getTime() - 172800).toISOString());
                }
                catch(e) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const error = e as any;
                    notify("error", "Error occured", "warning", error);
                    this.lyrics = await api.songs.getAllLyrics(this, language, "json", 0);
                }
            }

            this.lyrics = this.lyrics.length > 0 ? this.lyrics : this.lyrics = (await cache.getAll("lyrics")).filter(l => l.collectionIds.some(col => col == this.id));
        }

        this._loading = false;
    }

    public get loading() {
        return this._loading;
    }

    public getDetails(language?: string){
        return this.getTranslatedProperty(this.details, language);
    }

    public getSong(number: number) {
        return this.songs.find(s => s.getNumber(this.id) === number);
    }

    public get origins() {
        const origins: Origin[] = [];

        for (const song of this.songs) {
            if (song.melodyOrigin != undefined && !origins.find(o => o.country == song.melodyOrigin?.country)) {
                origins.push(song.melodyOrigin);
            }
        }

        return origins;
    }

    private _lists: {
        [key: string]: ListEntry[];
    } = {};

    public get Lists(): {
        [key: string]: (filterString?: string, filter?: SongFilter) => ListEntry[]; 
    }{
        const f = (key: string, filterString?: string, filter?: SongFilter) => {
            return this._lists[key].map(i => {
                let songs = i.songs;

                filter = filter ?? this.store.state.songs.filter;

                if (filter) {
                    filter.SetSongs(songs);
                    songs = filter.GetSongs();
                }

                return {
                    title: i.title,
                    count: i.count,
                    action: i.action,
                    songs: filterString ? songs.filter(s => s.getNumber(this.id).toString().includes(filterString)) : songs,
                };
            }).filter(i => i.songs.length);
        };

        return Object.keys(this._lists).reduce((a, b) => {
            a[b] = (filterString?: string, filter?: SongFilter) => f(b, filterString, filter);
            return a;
        }, {} as {
            [key: string]: (filter?: string) => ListEntry[]; 
        });
    }

    public getList(value: Sort): ListEntry[] {
        this.listType = value;
        const songsPerCard = 50;
        let songs: Song[] = [];
        if (!this._lists[value]) {
            switch (value) {
                case "number":
                    this._lists[value] = this.songs.reduce((a, b) => {
                        const number = Math.floor((b.getNumber(this.id) - 1) / songsPerCard);
                        let entry = a[number];
                        if (!entry) {
                            entry = {
                                title: `${(number * songsPerCard) + 1}-${number * songsPerCard + songsPerCard}`,
                                songs: [],
                                count: false,
                            };
                            a[number] = entry;
                        }
                        entry.songs.push(b);

                        return a;
                    }, [] as ListEntry[]).map(i => {
                        i.songs = i.songs.sort((a, b) => a.getNumber(this.id) - b.getNumber(this.id));
                        return i;
                    });
                    break;
                case "title":
                    songs = this.songs.sort((a, b) => a.getName() > b.getName() ? 1 : -1);
                    this._lists[value] = songs.reduce((a, b) => {
                        const letter = b.getName()
                            .replace(/[\W]/g, "")[0]
                            .toUpperCase();
                        if (letter) {
                            let entry = a.find(i => i.title === letter);
                            if (!entry) {
                                entry = {
                                    title: letter,
                                    songs: [],
                                    count: true,
                                };
                                a.push(entry);
                            }
                            entry.songs.push(b);
                        }
                        return a;
                    }, [] as ListEntry[]);
                    break;
                case "views":
                    songs = this.songs.sort((a, b) => a.Views > b.Views ? -1 : 1);
                    this._lists[value] = songs.reduce((a, b, i) => {
                        const number = Math.floor((i)/songsPerCard);

                        let entry = a[number];
                        if (!entry) {
                            entry = {
                                title: `${number * songsPerCard + 1}-${number * songsPerCard + songsPerCard}`,
                                songs: [],
                                count: false,
                            };
                            a.push(entry);
                        }
                        entry.songs.push(b);

                        return a;
                    }, [] as ListEntry[]);
                    break;
                case "countries":
                    songs = this.songs.filter(s => s.origins.some(o => o.type === "text")).sort((a, b) => a.getName() < b.getName() ? 1 : -1);
                    this._lists[value] = appSession.countries.map(i => 
                        {
                            return {
                                title: i.getName(),
                                count: true,
                                songs: songs.filter(s => s.origins.some(o => o.type === "text" && o.country === i.countryCode)),
                            };
                        },
                    );
                    break;
                case "themes":
                    songs = this.songs.filter(i => i.themeIds.length).sort((a, b) => a.getName() < b.getName() ? 1 : -1);
                    this._lists[value] = appSession.themes.map(i => 
                        {
                            return {
                                title: i.getName(),
                                count: true,
                                songs: songs.filter(i => i.themeIds.includes(i.id)),
                            };
                        },
                    );
                    break;
                case "genre":
                    songs = this.songs.filter(i => i.genreIds.length).sort((a, b) => a.getName() < b.getName() ? 1 : -1);
                    this._lists[value] = appSession.genres.map(i =>
                        {
                            return {
                                title: i.getName(),
                                count: true,
                                songs: songs.filter(s => s.genreIds.includes(i.id)),
                            };
                        },
                    );
                    break;
                case "categories":
                    songs = this.songs.filter(i => i.categoryIds.length).sort((a, b) => a.getName() < b.getName() ? 1 : -1);
                    this._lists[value] = appSession.categories.map(i => 
                        {
                            return {
                                title: i.getName(),
                                count: true,
                                songs: songs.filter(s => s.categoryIds.includes(i.id)),
                            };
                        },
                    );
                    break;
                case "author":
                case "composer":
                    this._lists[value] = this.contributors.map(i => {
                        return {
                            title: i.name,
                            count: true,
                            songs: this.songs.filter(s => s.participants.some(p => p.type === value && p.contributorId === i.id)),
                            action: () => router.push({
                                name: "contributor",
                                params: {
                                    contributor: i.id,
                                },
                            }),
                        };
                    });
                    break;
                default:
                    return this.getList(this.defaultSort);
            }
        }
        return this._lists[value];
    }

    public view() {
        if (this.type === "song") {
            router.push({
                name: "song-list",
                params: {
                    collection: this.keys.default ?? this.id,
                },
            });
        }

        if (this.type === "scripture") {
            router.push({
                name: "book-list",
                params: {
                    scriptureId: this.keys.default,
                },
            });
        }

        if (this.type === "publication") {
            router.push({
                name: "publication-collection",
                params: {
                    collectionId: this.keys.default ?? this.id,
                },
            });
        }
    }

    public get title() {
        return this.name;
    }

    private async getProduct() {
        return (await storeService.getProducts()).find(p => p.collectionIds.includes(this.id));
    }

    public async addToCart() {
        const product = await this.getProduct();
        if (product) {
            storeService.addProduct(product.id);
        }
    }

    public async inCart() {
        const product = await this.getProduct();

        if (product) {
            return storeService.cart.includes(product.id);
        }
        return false;
    }
}
