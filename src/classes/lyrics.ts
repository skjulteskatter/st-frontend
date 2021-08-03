import { ApiLyrics } from "dmb-api";
import { transposer } from "./transposer";

type Content = {
    [key: string]: {
        name: string;
        content: string[];
    };
}

export class Lyrics implements ApiLyrics {
    id: string;
    songId: string;
    collectionIds;
    number: number;
    content: Content | string;
    format;
    hasChords;
    languageKey;
    originalKey;
    transposedToKey;
    transpositions;
    secondaryChords;
    notes;

    constructor(lyrics: ApiLyrics) {
        this.id = lyrics.id;
        this.songId = lyrics.songId;
        this.number = lyrics.number;
        this.collectionIds = lyrics.collectionIds;
        this.content = lyrics.content;
        this.format = lyrics.format;
        this.hasChords = lyrics.hasChords;
        this.originalKey = lyrics.originalKey;
        this.languageKey = lyrics.languageKey;
        this.transposedToKey = lyrics.transposedToKey;
        this.transpositions = lyrics.transpositions;
        this.secondaryChords = lyrics.secondaryChords;
        this.notes = lyrics.notes;
    }

    public get transposition() {
        return this.transposedToKey ? transposer.getTransposition(this.originalKey, this.transposedToKey) : [-12, 0];
    }

    public get verses() {
        const verses: {
            [key: string]: Verse;
        } = {};

        let number = 1;
        let chorus: Verse = {} as Verse;

        for (const key of Object.keys(this.content)) {
            const type = key.split("_")[0];

            const verse: Verse = {
                name: (this.content as JsonContent)[key].name,
                content: (this.content as JsonContent)[key].content,
                type,
            };

            if (type == "chorus") {
                if (chorus.name) {
                    number--;
                }
                verses[number] = verse;
                number++;
                chorus = verse;
            } else {
                verses[number] = verse;
                number++;
                if (chorus.name) {
                    verses[number] = Object.assign({}, chorus);
                    number++;
                }
            }
        }
        return verses;
    }

    public get rawContent() {
        const lines = [];

        if (typeof(this.content) == typeof("")) {
            throw new Error(`Number ${this.number} is bugged. Check with system admin.`);
        }
        
        const keys = Object.keys(this.content ?? {}) ?? [];

        for (const key of keys) {
            for (const line of (this.content as JsonContent)[key].content) {
                lines.push(line);
            }
        }

        return lines.join(" ").replace(/[^A-Za-z0-9æøå ,.]/g, "").replace("  ", " ");
    }

    public get transposedContent() {
        return this.content as string;
    }

    public get currentKey() {
        

        return "";
    }

    public get lines() {
        const ls: string[] = [];
        const content = this.content as Content;
        for (const key of Object.keys(content)) {
            content[key].content.forEach(s => ls.push(s));
        }
        return ls;
    }
}
