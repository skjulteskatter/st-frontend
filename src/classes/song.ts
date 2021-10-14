import { ApiCollection, ApiSong, Format, MediaFile } from "dmb-api";
import BaseClass from "./baseClass";
import { appSession } from "@/services/session";
import router from "@/router";
import { songs } from "@/services/api";
import { logs } from "@/services/logs";
import { Lyrics, Participant } from ".";

export default class Song extends BaseClass implements ApiSong {
    public id: string;
    public type: string;
    public available: boolean;
    public image?: string;

    public get number() {
        return this.collections[0]?.number ?? 0;
    }
    public getNumber(cId: string) {
        return this.collections.find(c => c.id == cId)?.number ?? -1;
    }
    public collections: {
        id: string;
        collection?: ApiCollection;
        number?: number;
    }[];
    public copyrights;
    public transpositions: {
        [key: string]: number;
    };
    public originalKey: string;
    public verses: number;

    public origins: {
        type: "text" | "melody";
        country: string;
        description: LocaleString;
    }[];

    public themeIds: string[];
    public categoryIds: string[];
    public genreIds: string[];

    public participants: Participant[] = [];
    public yearWritten;
    public yearComposed;

    private _files?: MediaFile[];

    public get files(): MediaFile[] {
        if (!this._files) {
            this._files = appSession.files.filter(f => f.songId == this.id);
        }
        return this._files;
    }

    public get audioFiles(): MediaFile[] {
        return this.files.filter(f => f.type === "audio");
    }
    public get videoFiles(): MediaFile[] {
        return this.files.filter(f => f.type === "video");
    }
    public get sheetMusic(): MediaFile[] {
        return this.files.filter(f => f.type.startsWith("sheetmusic"));
    }

    public details: LocaleString;
    public hasLyrics: boolean;
    public hasChords;
    public newMelody: boolean;
    public newMelodies: string[];

    public raw;

    constructor(song: ApiSong) {
        super();
        this.raw = song;

        this.collections = song.collections;
        this.available = song.available;
        this.id = song.id;
        this.name = song.name;
        this.participants = song.participants?.map(c => new Participant(c)) ?? [];
        this.yearWritten = song.yearWritten;
        this.yearComposed = song.yearComposed;
        this.details = song.details ?? {};
        this.copyrights = song.copyrights;
        this.type = song.type;
        this.hasLyrics = song.hasLyrics;
        this.hasChords = song.hasChords;
        this.originalKey = song.originalKey;
        this.transpositions = song.transpositions ?? {};
        this.verses = song.verses;
        this.image = song.image;

        this.origins = song.origins ?? [];
        this.themeIds = song.themeIds ?? [];
        this.categoryIds = song.categoryIds ?? [];
        this.genreIds = song.genreIds ?? [];

        this.collections = song.collections;
        this.newMelody = song.newMelody;
        this.newMelodies = song.newMelodies;
    }

    public get themes() {
        return this.themeIds.length ? appSession.themes.filter(t => this.themeIds.includes(t.id)) : [];
    }

    public get categories() {
        return this.categoryIds.length ? appSession.categories.filter(i => this.categoryIds.includes(i.id)) : [];
    }

    public get collectionIds() {
        return this.collections.map(c => c.id);
    }

    public anotherLanguage(lan?: string) {
        lan = lan ?? this.store.getters.languageKey;
        return !Object.keys(this.name).includes(lan) && this.type == "lyrics";
    }
        

    public view() {
        if (!this.available) return;
        const col = appSession.collections.find(c => this.collectionIds.includes(c.id));

        if (col)
            router.push({
                name: "song",
                params: {
                    collection: col.key,
                    number: this.getNumber(col.id) ?? this.id,
                },
            });
    }

    public get Views() {
        return appSession.Views[this.id];
    }

    public loadingLyrics = false;

    public async getLyrics(language?: string) {
        this.loadingLyrics = true;
        try {
            language = language ?? this.store.getters.languageKey;
            let lyrics = appSession.lyrics.find(l => l.songId === this.id && l.languageKey === language);
            if (!lyrics) {
                lyrics = new Lyrics(await songs.getSongLyrics(this.id, language, "json", 0, "common"));
                appSession.lyrics.push(lyrics);
            }
            logs.event("lyrics_view", {
                "collection_id": this.store.getters.collection?.id,
                "song_id": this.id,
                "lyrics_language": language,
                "lyrics_id": lyrics.id,
            });
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    public async transposeLyrics(transpose: number, language?: string, transcode?: string, newMelody = false, format: Format = "performance"): Promise<Lyrics> {
        this.loadingLyrics = true;
        try {
            language = language ?? this.store.getters.languageKey;
            let lyrics = appSession.lyrics.find(l => l.songId === this.id && l.languageKey === language && l.format === format && l.transposition.includes(transpose) && l.secondaryChords === newMelody);
            if (!lyrics) {
                lyrics = new Lyrics(await songs.getSongLyrics(this.id, language, format, transpose, transcode ?? "common", newMelody));
                appSession.lyrics.push(lyrics);
            }
            if (lyrics)
                logs.event("lyrics_transpose", {
                    "collection_id": this.store.getters.collection?.id,
                    "song_id": this.id,
                    "lyrics_id": lyrics.id,
                    "lyrics_language": language,
                    "lyrics_transposition": transpose,
                });
            return lyrics;
        }
        finally {
            this.loadingLyrics = false;
        }
    }

    private get collection () {
        return this.store.getters.collection;
    }

    private get previousSong() {
        const songs = this.collection?.songs ?? [];

        const index = songs.findIndex(i => i.id == this.id);

        return songs[index - 1];
    }
    private get nextSong() {
        const songs = this.collection?.songs ?? [];

        const index = songs.findIndex(i => i.id == this.id);

        return songs[index + 1];
    }

    public next() {
        this.nextSong?.view();
    }
    
    public previous() {
        this.previousSong?.view();
    }

    public get hasNext() {
        return this.nextSong != undefined;
    }

    public get hasPrevious() {
        return this.previousSong != undefined;
    }

    public language(code: string): boolean {
        if (Object.keys(this.name).includes(code)) return true;

        return false;
    }

    public get copyright() {
        return {
            text: appSession.copyrights.find(c => c.id == this.copyrights.find(c => c.type == "text")?.copyrightId),
            melody: appSession.copyrights.find(c => c.id == this.copyrights.find(c => c.type == "melody")?.copyrightId),
        };
    }

    public get Participants() {
        return appSession.contributors.filter(c => this.participants.some(i => i.contributorId === c.id)).map(i => i.item);
    }

    public get Authors() {
        return appSession.contributors.filter(c => this.participants.filter(p => p.type == "author").some(i => i.contributorId == c.id)).map(i => i.item);
    }

    public get Composers() {
        return appSession.contributors.filter(c => this.participants.filter(p => p.type == "composer").some(i => i.contributorId == c.id)).map(i => i.item);
    }

    public get originCountry() {
        const country = this.origins.find(o => o.type === "text")?.country;
        return country?.toUpperCase();
    }

    public get melodyOrigin() {
        return this.origins.find(o => o.type === "melody");
    }

    public get Description() {
        const description = this.getTranslatedProperty(this.details, this.store.getters.languageKey);

        return description?.replace(/<p>/g, "<p class='mb-2'>");
    }

    public get Tags() {
        return appSession.tags.filter(i => i.songIds.includes(this.id));
    }

    public get Collections() {
        return appSession.collections.filter(i => this.collections.some(c => c.id === i.id));
    }
}
