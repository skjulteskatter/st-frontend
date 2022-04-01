import {
    Lyrics,
    Tag,
} from "@/classes";
import { ICustomCollection, ShareKey } from "songtreasures-api";
import { analytics, items, sharing } from "./api";
import auth, { analytics as googleAnalytics } from "./auth";
import { cache } from "./cache";
import Favorites from "@/classes/favorites";
import { Language } from "songtreasures";
import { Collection, Settings, User, Session as HTSession } from "hiddentreasures-js";
import client from "./client";
import collectionService from "./collectionService";

export class Session {
    private _initialized?: boolean;
    private _session: HTSession | null = null;

    public get session() {
        if (!this._session)
            throw new Error("Session not found");
        return this._session;
    }

    public set session(v) {
        this._session = v;
    }

    public get Session() {
        return this._user ?? null;
    }

    private _user: User | null = null;

    public get user() {
        if (!this._user)
            throw new Error("User not found");
        return this._user;
    }

    public set user(v) {
        this._user = v;
    }

    public get User() {
        return this._user ?? null;
    }
    
    private _settings: Settings | null = null;

    public get settings() {
        if (!this._settings)
            throw new Error("User not found");
        return this._settings;
    }

    public set settings(v) {
        this._settings = v;
    }

    public get Settings() {
        return this._settings ?? null;
    }

    private get expiry() {
        return new Date().getTime() + 3600000;
    }

    public collections: Collection[] = [];

    public favorites = new Favorites();

    public tags: Tag[] = [];
    public customCollections: ICustomCollection[] = [];
    public languages: Language[] = [];

    public lyrics: Lyrics[] = [];

    public get initialized() {
        return this._initialized === true;
    }

    public async init() {
        if (this._initialized === false) {
            while (this._initialized === false) {
                await new Promise(r => setTimeout(r, 100));
            }
            return;
        }
        if (this.initialized)
            return;

        this._session ??= await client.getSession();
        this._user ??= await client.getUser();
        this._settings ??= await client.getSettings();

        googleAnalytics.setUserId(this.user.id);

        this.languages = (await cache.getOrCreateAsync("languages", items.getLanguages, this.expiry)) ?? [];

        await this.favorites.init();

        this.collections = await collectionService.list();

        // Set users initial language
        if(!this.settings.defaultLanguage) {
            try {
                this.settings.defaultLanguage = navigator.language.split("-")[0];
            }
            catch {
                this.settings.defaultLanguage = "en";
            }
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

    public get Language() {
        return this.settings.defaultLanguage ?? "en";
    }

    public async clear() {
        await auth.logout();
    }

    private _onReady: (() => void)[] = [];
    public onReady(f: () => void) {
        this._onReady.push(f);
    }
    public ready(authenticated = false) {
        for (const f of this._onReady) {
            f();
        }
        this._onReady = [];
        this.Ready = true;
        this.Authenticated = authenticated;
    }
    public Ready = false;
    public Authenticated = false;

    public getCollection(key: string) {
        const collection = this.collections.find(i => i.id === key || i.key === key || Object.values(i.keys).includes(key));
        if (!collection) {
            throw new Error("Collection not found");
        }
        return collection;
    }
}

export const appSession = new Session();
