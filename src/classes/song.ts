import { ApiSong, MediaFile } from "dmb-api";
import { Collection } from "./collection";
import { Contributor } from "./contributor";
import { Participant } from "./participant";
import { BaseClass } from "./baseClass";
import { Converter } from "showdown";
const converter = new Converter();

export enum SheetMusicTypes {
    PDF = "sheetmusic-pdf",
    XML = "sheetmusic"
}

export class Song extends BaseClass implements ApiSong {
    public id: string;
    public number = 0;
    public type: string;
    public image?: string;
    public collectionIds;
    public collections: Collection[];
    public copyrights;
    public transpositions: {
        [key: string]: number;
    };
    public originalKey: string;
    public verses: number;

    public origins;

    public themeIds;

    public authors: Contributor[] = []
    public composers: Contributor[] = [];
    public participants: Participant[] = [];
    public yearWritten = 0;
    public themes: Theme[] = [];
    public audioFiles: MediaFile[] = [];
    public videoFiles: MediaFile[] = [];
    public sheetMusic: MediaFile[] = [];
    public details: LocaleString;
    public hasLyrics: boolean;
    public hasChords;
    public newMelody: boolean;

    constructor(song: ApiSong) {
        super();
        this.id = song.id;
        this.number = song.number;
        this.name = song.name;
        this.participants = song.participants.map(c => new Participant(c)) ?? [];
        this.authors = this.participants.filter(p => p.type == "author").map(p => p.contributor ?? {} as Contributor);
        this.composers = this.participants.filter(p => p.type == "composer").map(p => p.contributor ?? {} as Contributor);
        this.yearWritten = song.yearWritten;
        this.audioFiles = song.files?.filter(f => f.type == "audio") ?? [];
        this.videoFiles = song.files?.filter(f => f.type == "video") ?? [];
        this.sheetMusic = song.files?.filter(f => f.type == "sheetmusic") ?? [];
        this.details = song.details ?? {};
        this.copyrights = song.copyrights;
        this.type = song.type;
        this.themes = song.themes ?? [];
        this.hasLyrics = song.hasLyrics;
        this.hasChords = song.hasChords;
        this.originalKey = song.originalKey;
        this.transpositions = song.transpositions ?? {};
        this.verses = song.verses;
        this.image = song.image;

        this.origins = song.origins;

        this.collectionIds = song.collectionIds;
        this.themeIds = song.themeIds;

        this.collections = song.collections ? song.collections.map(c => new Collection(c)) : [];
        this.newMelody = song.newMelody;
    }

    public language(code: string): boolean {
        if (Object.keys(this.name).includes(code)) return true;

        return false;
    }

    public get description() {

        const contents: {
            [key: string]: string;
        } = {};

        for (const key of Object.keys(this.details)) {
            contents[key] = converter.makeHtml(this.details[key]);
        }

        return contents;
    }

    public get copyright() {
        return {
            text: this.copyrights.find(c => c.type == "text")?.copyright,
            melody: this.copyrights.find(c => c.type == "melody")?.copyright,
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
        return this.origins.find(o => o.type == "text")?.country;
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
