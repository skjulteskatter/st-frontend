import api from "@/services/api";
import { ApiCollection, ApiContributor, ApiSong } from "dmb-api";
import { Lyrics, Song } from ".";
import { BaseClass } from "./baseClass";
import { cache } from "@/services/cache";
import { notify } from "@/services/notify";
import { useStore } from "@/store";
import { CollectionItem } from "./collectionItem";
import { getContributors } from "@/functions/helpers";
import { appSession } from "@/services/session";
import { logs } from "@/services/logs";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";

type CollectionSettings = {
    offline: boolean;
    lastSynced?: string;
}

export class Collection extends BaseClass implements ApiCollection {
    public id;

    private store = useStore();
    private _key;
    public keys: LocaleString;
    public defaultType;
    public available?: boolean;
    public details?: LocaleString;
    public hasChords: {
        [lang: string]: boolean;
    };

    public image: string;

    public settings?: CollectionSettings;

    private _initialized = false;
    private _loading = false;

    public contributors?: CollectionItem<ApiContributor>[];
    public songs: Song[] = [];
    public lyrics: Lyrics[] = [];
    
    public hasAuthors = false;
    public hasComposers = false;
    public hasCountries = false;
    public hasThemes = false;
    public hasTags = false;

    public themeTypes: Theme[] = [];

    public loadingLyrics = false;

    private _themes?: CollectionItem<Theme>[];
    private _loadingThemes = false;

    private _tags?: CollectionItem<SongTag>[];
    private _loadingTags = false;

    private _authors?: CollectionItem<ApiContributor>[];
    private _composers?: CollectionItem<ApiContributor>[];

    private _countries?: CollectionItem<Country>[];
    private _loadingCountries = false;

    private _currentLanguage = "";

    constructor(collection: ApiCollection) {
        super();
        this._key = collection.key;
        this.keys = collection.keys ?? {};
        this.defaultType = collection.defaultType;
        this.id = collection.id;
        this.name = collection.name;
        this.image = collection.image;
        this.available = collection.available;
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

            await appSession.init();

            if (this.available) {
                this.songs = appSession.songs.filter(s => s.collectionIds.some(c => this.id == c));
            } else {
                const files = await api.songs.getFiles([this.id]);
                appSession.files.push(...files.result);
                this.songs = (await api.songs.getAllSongs([this.id])).result.map(s => new Song(s));
            }

            this.hasAuthors = this.hasAuthors || this.songs.some(s => s.participants.some(p => p.type == "author"));
            this.hasComposers = this.hasComposers || this.songs.some(s => s.participants.some(p => p.type == "composer"));
            this.hasThemes = this.hasThemes || this.songs.some(s => s.themeIds.length > 0);
            this.hasCountries = this.hasCountries || this.songs.some(s => s.origins.some(o => o.type == "text"));
            this.hasTags = this.hasTags || this.songs.some(s => s.tagIds.length > 0);
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
                    notify("error", "Error occured", "warning", e);
                    this.lyrics = await api.songs.getAllLyrics(this, language, "json", 0);
                }
            }

            this.lyrics = this.lyrics.length > 0 ? this.lyrics : this.lyrics = (await cache.getAll("lyrics")).filter(l => l.collectionIds.some(col => col == this.id));
        }

        this._loading = false;
    }

    private async loadContributors() {
        this.contributors = (await getContributors(this.settings?.offline == true)).filter(c => this.songs.some(s => s.participants.some(p => p.contributorId == c.id)));
    }

    public get loading() {
        return this._loading || this._loadingThemes || this._loadingCountries;
    }

    public get product() {
        return this.store.getters.products.find(p => p.collectionIds.includes(this.id));
    }

    public get owned() {
        const prod = this.product;

        return prod && this.store.getters.user?.subscriptions.some(s => s.productIds.includes(prod.id));
    }

    public addToCart() {
        const prod = this.product;
        this.store.commit(StripeMutationTypes.CART_ADD_PRODUCT, prod?.id);
    }

    public getDetails(language: string){
        return this.getTranslatedProperty(this.details, language);
    }

    public getSong(number: number) {
        return this.songs.find(s => s.number == number);
    }

    public filteredSongs(filter: string, songFilter: SongFilter) {
        filter = filter.toLowerCase();

        const context: {
            [key: string]: string;
        } = {};

        const number = parseInt(filter);

        let numbers: number[] = [];
        
        if (number) {
            numbers = this.songs.filter(s => s.number == number || s.number.toString().includes(number.toString())).map(s => s.number);
        } else {
            for (const song of this.songs) {
                if (!numbers.includes(song.number)) {
                    if (song.names.find(n => n.toLowerCase().includes(filter)) || song.id.toLowerCase().includes(filter)) {
                        numbers.push(song.number);
                        continue;
                    }
                    if (song.authors.find(a => a.name.toLowerCase().includes(filter)) || song.composers.find(c => c.name.toLowerCase().includes(filter))) {
                        numbers.push(song.number);
                        continue;
                    }
                }
            }

            for (const lyrics of this.lyrics) {
                if (numbers.includes(lyrics.number)) continue;

                const content = lyrics.rawContent.toLowerCase();
                
                if (content.includes(filter)) {
                    numbers.push(lyrics.number);
    
                    const index = content.indexOf(filter);
    
                    const start = (index - 20) > 0 ? index - 20 : 0;
    
                    context[lyrics.number] = context[lyrics.number] ?? (start !== 0 ? "..." : "") + lyrics.rawContent.substr(start, filter.length + 40) + "...";
    
                    continue;
                }
            }
        }

        const {themes, audioFiles, videoFiles, origins, contentTypes, sheetMusicTypes } = songFilter;

        const songs = this.songs.filter(s => 
            (numbers.includes(s.number) || s.rawContributorNames.includes(filter)) 
            && (themes.length == 0 || s.themes.filter(t => themes.includes(t.id)).length)
            && (origins.length == 0 || (s.melodyOrigin != null && origins.includes(s.melodyOrigin.country)))
            && (audioFiles.length == 0 || s.audioFiles.filter(a => audioFiles.includes(a.category)).length)
            && (videoFiles.length == 0 || s.videoFiles.filter(v => videoFiles.includes(v.category)).length)
            && (contentTypes.length == 0 || (contentTypes.includes("lyrics") 
                && s.hasLyrics) || (contentTypes.includes("audio") 
                && s.audioFiles.length > 0) || (contentTypes.includes("video") 
                && s.videoFiles.length > 0) || (contentTypes.includes("sheetmusic") 
                && s.sheetMusic.length > 0) )
            && (sheetMusicTypes.length == 0 || s.sheetMusic.find(sm => sheetMusicTypes.includes(sm.category))),
        );

        return {
            songs,
            context,
        };
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

    public async getList(value: string) {
        if (value == "authors") {
            if (!this._authors) {
                if (!this.contributors)
                    await this.loadContributors();
                    this._authors = this.contributors?.map(c => {
                        const cItem: CollectionItem<ApiContributor> = {
                            songIds: this.songs.filter(s => s.participants.find(p => p.contributorId == c.id && p.type == "author")).map(s => s.id),
                            id: c.id,
                            fileIds: c.fileIds,
                            item: c.item,
                        };
                        return cItem;
                    }) ?? [];   
                return this._authors.length;
            }
        }
        if (value == "composers") {
            if (!this._composers) {
                if (!this.contributors)
                    await this.loadContributors();
                this._composers = this.contributors?.map(c => {
                    const cItem: CollectionItem<ApiContributor> = {
                        songIds: this.songs.filter(s => s.participants.find(p => p.contributorId == c.id && p.type == "composer")).map(s => s.id),
                        id: c.id,
                        fileIds: c.fileIds,
                        item: c.item,
                    };
                    return cItem;
                }) ?? [];   
                return this._composers.length;
            }
        }
        if (value == "countries") {
            if (!this._countries) {
                this._loadingCountries = true;
                const countries = await api.songs.getAllCountries(this);

                this._countries = countries.map(c => new CollectionItem(c));

                this._loadingCountries = false;
                return this._countries?.length;
            }
        }
        if (value == "themes") {
            if (!this._themes) {
                this._loadingThemes = true;

                const themes = await api.songs.getAllThemes(this);

                this._themes = themes.map(t => new CollectionItem(t));

                this._loadingThemes = false;
                return this._themes.length;
            }
        }
        if (value == "tags") {
            if (!this._tags) {
                this._loadingTags = true;

                const tags = await api.songs.getAllTags(this);

                this._tags = tags.map(t => new CollectionItem(t));

                this._loadingTags = false;
                return this._tags.length;
            }
        }

        return 1;
    }

    public async transposeLyrics(number: number, transpose: number, language?: string, transcode?: string): Promise<Lyrics> {
        this.loadingLyrics = true;
        try {
            const song = this.songs.find(s => s.getNumber(this.id) == number);
            let lyrics = this.lyrics.find(l => l.number == number && l.languageKey == language && l.format == "html" && l.transposition == transpose);
            if (!lyrics) {
                lyrics = await api.songs.getLyrics(this, number, language ?? this._currentLanguage, "html", transpose, transcode ?? "common");
                this.lyrics.push(lyrics);
            }
            if (song)
                logs.event("lyricsChords", {
                    "collection_id": this.id,
                    "song_id": song.id,
                    "lyrics_id": lyrics.id,
                    "lyrics_language": language ?? "en",
                    "lyrics_transposition": transpose,
                });
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public async getLyrics(song: ApiSong, language: string): Promise<Lyrics> {
        this.loadingLyrics = true;
        try {
            let lyrics = this.lyrics.find(l => l.songId == song.id && l.languageKey == language);
            if (!lyrics) {
                lyrics = new Lyrics(await api.songs.getLyrics(this, song.collections.find(c => c.id == this.id)?.number ?? 0, language, "json", 0, "common"));
                this.lyrics.push(lyrics);
            }
            logs.event("lyrics", {
                "collection_id": this.id,
                "song_id": song.id,
                "lyrics_language": language,
                "lyrics_id": lyrics.id,
            });
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public get authors(): CollectionItem<ApiContributor>[] {
        return this._authors ?? [];
    }

    public get composers(): CollectionItem<ApiContributor>[] {
        return this._composers ?? [];
    }

    public get countries(): CollectionItem<Country>[] {
        return this._countries ?? [];
    }

    public get themes(): CollectionItem<Theme>[] {
        return this._themes ?? [];
    }

    public get tags(): CollectionItem<SongTag>[] {
        return this._tags ?? [];
    }

    public getContributors(type: string) {
        if (type == "authors") {
            return this.authors;
        } else if (type == "composers") {
            return this.composers;
        } else {
            return [];
        }
    }
}
