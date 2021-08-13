import { ApiCollection, ApiSong, MediaFile } from "dmb-api";
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
    public tagIds: string[];
    public genreIds: string[];

    public participants: Participant[] = [];
    public yearWritten;
    public yearComposed;

    public files?: MediaFile[];

    public audioFiles: MediaFile[] = [];
    public videoFiles: MediaFile[] = [];
    public sheetMusic: MediaFile[] = [];
    public details: LocaleString;
    public hasLyrics: boolean;
    public hasChords;
    public newMelody: boolean;
    public newMelodies: string[];

    public raw;

    // public get raw(): ApiSong {
    //     return {
    //         id: this.id,
    //         available: this.available,
    //         collections: this.collections,
    //         copyrights: this.copyrights,
    //         genreIds: this.genreIds,
    //         hasChords: this.hasChords,
    //         hasLyrics: this.hasLyrics,
    //         name: this.name,
    //         newMelodies: this.newMelodies,
    //         newMelody: this.newMelody,
    //         originalKey: this.originalKey,
    //         origins: this.origins,
    //         participants: this.participants,
    //         tagIds: this.tagIds,
    //         themeIds: this.themeIds,
    //         type: this.type,
    //         verses: this.verses,
    //         details: this.details,
    //         yearComposed: this.yearComposed,
    //         yearWritten: this.yearWritten,
    //     };
    // }

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
        this.files = appSession.files.filter(f => f.songId == this.id);
        this.audioFiles = this.files.filter(f => f.type == "audio") ?? [];
        this.videoFiles = this.files.filter(f => f.type == "video") ?? [];
        this.sheetMusic = this.files.filter(f => f.type.startsWith("sheetmusic")) ?? [];
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
        this.genreIds = song.genreIds ?? [];

        this.collections = song.collections;
        this.newMelody = song.newMelody;
        this.newMelodies = song.newMelodies;

        this.files = song.files;
    }

    public get themes() {
        return this.themeIds.length ? appSession.themes.filter(t => this.themeIds.includes(t.id)) : [];
    }

    public get tags() {
        const tags = this.tagIds.length ? appSession.Tags.filter(t => this.tagIds.includes(t.id)) : [];
        return tags;
    }

    public get collectionIds() {
        return this.collections.map(c => c.id);
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

    public get Authors() {
        return appSession.contributors.filter(c => this.participants.filter(p => p.type == "author").some(i => i.contributorId == c.id)).map(i => i.item);
    }

    public get Composers() {
        return appSession.contributors.filter(c => this.participants.filter(p => p.type == "composer").some(i => i.contributorId == c.id)).map(i => i.item);
    }


    public get rawContributorNames() {
        const names: string[] = [];

        this.Authors.forEach(a => {
            names.push(a.name.toLowerCase());
        });

        this.Composers.forEach(c => {
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
