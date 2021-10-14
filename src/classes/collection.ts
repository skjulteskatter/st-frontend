import api from "@/services/api";
import { ApiCollection, ApiContributor, Sort } from "dmb-api";
import { ListEntry, Lyrics, Song, CollectionItem } from ".";
import BaseClass from "./baseClass";
import { cache } from "@/services/cache";
import { notify } from "@/services/notify";
import { appSession } from "@/services/session";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import router from "@/router";

type CollectionSettings = {
    offline: boolean;
    lastSynced?: string;
}

let closeId: string | null = null;

export default class Collection extends BaseClass implements ApiCollection {
    public id;
    private _key;
    public enabled;
    public freeSongs;
    public keys: LocaleString;
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

    public details?: LocaleString;
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

    constructor(collection: ApiCollection) {
        super();
        this._key = collection.key;
        this.enabled = collection.enabled;
        this.freeSongs = collection.freeSongs;
        this.keys = collection.keys ?? {};
        this.defaultType = collection.defaultType;
        this._defaultSort = collection.defaultSort;
        this.listType = this.defaultSort;
        this.id = collection.id;
        this.name = collection.name;
        this.image = collection.image;
        this._available = collection.available;
        this.details = collection.details;
        this.hasChords = collection.hasChords ?? {};
        cache.get("config", "collection_" + this.id).then((r) => {
            this.settings = JSON.parse(r as string | undefined ?? "{\"offline\": false}") as CollectionSettings;
        });
    }

    public get key() {
        return this.keys[this.store.getters.languageKey] ?? this._key;
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

            if (this.available) {
                this.songs = appSession.songs.filter(s => s.collectionIds.some(c => this.id == c)).sort((a, b) => a.getNumber(this.id) - b.getNumber(this.id));
            } else {
                const files = await api.songs.getFiles([this.id]);
                appSession.files.push(...files.result);
                this.songs = ((await api.songs.getAllSongs([this.id])).result.map(s => new Song(s))).sort((a, b) => a.getNumber(this.id) - b.getNumber(this.id));
            }

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

    public get product() {
        return this.store.state.stripe.products.find(p => p.collectionIds.includes(this.id));
    }

    // public get owned() {
    //     const prod = this.product;

    //     return prod && this.store.getters.user?.subscriptions.some(s => s.productIds.includes(prod.id));
    // }

    public get inCart() {
        return this.product ? this.store.state.stripe.cart.includes(this.product?.id) : false;
    }

    public addToCart() {
        const prod = this.product;
        this.store.commit(StripeMutationTypes.CART_ADD_PRODUCT, prod?.id);

        if (this.store.state.stripe.cart.length > 1) {
            this.store.commit(StripeMutationTypes.CART_SHOW, true);
            closeId = this.id;

            setTimeout(() => {
                if (closeId !== null && closeId === this.id) {
                    this.store.commit(StripeMutationTypes.CART_SHOW, false);
                    closeId = null;
                }
            }, 3000);
        }
    }

    public getDetails(language: string){
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
        [key: string]: (filter?: string) => ListEntry[]; 
    }{
        const f = (key: string, filter?: string) => {
            return this._lists[key].map(i => {
                return {
                    title: i.title,
                    count: i.count,
                    action: i.action,
                    songs: filter ? i.songs.filter(s => s.getNumber(this.id).toString().includes(filter)) : i.songs,
                };
            }).filter(i => i.songs.length);
        };

        return Object.keys(this._lists).reduce((a, b) => {
            a[b] = (filter?: string) => f(b, filter);
            return a;
        }, {} as {
            [key: string]: (filter?: string) => ListEntry[]; 
        });
    }

    public async getList(value: Sort): Promise<ListEntry[]> {
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
}
