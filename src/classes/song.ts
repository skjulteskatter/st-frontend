import { ApiCollection, ApiSong, MediaFile } from "dmb-api";
import { Contributor } from "./contributor";
import { Participant } from "./participant";
import { BaseClass } from "./baseClass";
import i18n from "@/i18n";
import { appSession } from "@/services/session";
import router from "@/router";

export enum SheetMusicTypes {
    PDF = "sheetmusic-pdf",
    XML = "sheetmusic"
}

export class Song extends BaseClass implements ApiSong {
    public id: string;
    public type: string;
    public image?: string;

    public get number() {
        return this.collections[0]?.number ?? 0;
    }
    public getNumber(cId: string) {
        return this.collections.find(c => c.id == cId)?.number;
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
    public tagIds: string[];

    public authors: Contributor[] = []
    public composers: Contributor[] = [];
    public participants: Participant[] = [];
    public yearWritten = 0;
    public audioFiles: MediaFile[] = [];
    public videoFiles: MediaFile[] = [];
    public sheetMusic: MediaFile[] = [];
    public details: LocaleString;
    public hasLyrics: boolean;
    public hasChords;
    public newMelody: boolean;

    public get themes() {
        return this.themeIds.length ? appSession.themes.filter(t => this.themeIds.includes(t.id)) : [];
    }

    public get tags() {
        return this.tagIds.length ? appSession.tags.filter(t => this.tagIds.includes(t.id)) : [];
    }

    public get collectionIds() {
        return this.collections.map(c => c.id);
    }

    public get available() {
        return this.collections.some(n => n.number && n.number <= 5) || appSession.collections.some(c => c.available == true && this.collectionIds.includes(c.id));
    }

    public anotherLanguage(lan: string) {
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

    constructor(song: ApiSong) {
        super();

        this.collections = song.collections ;
        this.id = song.id;
        this.name = song.name;
        this.participants = song.participants?.map(c => new Participant(c)) ?? [];
        this.authors = this.participants.filter(p => p.type == "author").map(p => p.contributor ?? {} as Contributor);
        this.composers = this.participants.filter(p => p.type == "composer").map(p => p.contributor ?? {} as Contributor);
        this.yearWritten = song.yearWritten;
        const files = appSession.files.filter(f => f.songId == this.id);
        this.audioFiles = files.filter(f => f.type == "audio") ?? [];
        this.videoFiles = files.filter(f => f.type == "video") ?? [];
        this.sheetMusic = files.filter(f => f.type.startsWith("sheetmusic")) ?? [];
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
        this.tagIds = song.tagIds ?? [];

        this.collections = song.collections;
        this.newMelody = song.newMelody;
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

    public get rawContributorNames() {
        const names: string[] = [];

        this.authors.forEach(a => {
            names.push(a.name.toLowerCase());
        });

        this.composers.forEach(c => {
            names.push(c.name.toLowerCase());
        });

        return names.join("").replace(/[^0-9a-zA-Z]/g, "");
    }

    public get names() {
        const names: string[] = [];

        for (const key of Object.keys(this.name)) {
            names.push(this.name[key]);
        }

        return names;
    }

    public get originCountry() {
        const country = this.origins.find(o => o.type == "text")?.country;
        return country ? i18n.global.t(country.toUpperCase()) : undefined;
    }

    public get melodyOrigin() {
        return this.origins.find(o => o.type == "melody");
    }

    // public getRelativeTranspositions(t: string) {
    //     const ts = transposer.getTranspositions(this.originalKey) ?? {};

    //     const transpositions: {
    //         key: string;
    //         value: string;
    //     }[][] = [];

    //     for (const k of Object.keys(ts)) {
            
    //     } 
    // }
}
