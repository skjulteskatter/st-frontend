import { ILyrics, LyricsChordContent, LyricsContent } from "songtreasures";
import { transposer } from "./transposer";

export default class Lyrics implements ILyrics {
    id: string;
    songId: string;
    collectionIds;
    content: LyricsContent | LyricsChordContent[] | string;
    format;
    hasChords;
    languageKey;
    originalKey;
    transposedToKey;
    transpositions;
    secondaryChords;
    notes;

    public raw;

    constructor(lyrics: ILyrics) {
        this.raw = lyrics;
        this.id = lyrics.id;
        this.songId = lyrics.songId;
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
                name: (this.content as LyricsContent)[key].name,
                content: (this.content as LyricsContent)[key].content,
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

    public getText(translations: {
        chorus: string;
        bridge: string;
    }, presentation = false) {
        const verses: { name: string; content: string[] }[] = [];

        const types: {
            [key: string]: string;
        } = {
            "[Chorus]": "chorus",
            "[Bridge]": "bridge",
        };

        const content = presentation ? this.verses : this.content as LyricsContent;

        if (content) {
            for (const key of Object.keys(content)) {
                const verse: Verse = {
                    name: (content as LyricsContent)[key].name,
                    content: (content as LyricsContent)[key].content,
                    type:
                        types[(content as LyricsContent)[key].name] ??
                        "verse",
                };

                if (verse.type == "chorus") {
                    verse.name = translations.chorus;
                } else if (verse.type == "bridge") {
                    verse.name = translations.bridge;
                }

                verses.push(verse);
            }
        }

        return verses;
    }

    public get ContainsChords() {
        return this.format === "performance";
    }

    public get rawContent() {
        const lines = [];

        if (typeof(this.content) == typeof("")) {
            throw new Error(`${this.id} is bugged. Check with system admin.`);
        }
        
        const keys = Object.keys(this.content ?? {}) ?? [];

        for (const key of keys) {
            for (const line of (this.content as LyricsContent)[key].content) {
                lines.push(line);
            }
        }

        return lines.join(" ").replace(/[^A-Za-z0-9æøå ,.]/g, "").replace("  ", " ");
    }

    public get performanceView() {
        const verses: LyricsChordContent[] = [];

        let chorus;

        for (const v of this.content as LyricsChordContent[]) {
            if (v.key.startsWith("chorus")) {
                chorus = v;
            } else if(chorus && !verses.last()?.key.startsWith("chorus")) {
                verses.push(chorus);
            }
            verses.push(v);
        }
        if(chorus && !verses.last()?.key.startsWith("chorus")) {
            verses.push(chorus);
        }
        return verses;
    }

    public get versesWithChords() {
        return this.content as LyricsChordContent[];
    }

    public get currentKey() {
        return "";
    }

    public get lines() {
        const ls: string[] = [];
        const content = this.content as LyricsContent;
        for (const key of Object.keys(content)) {
            content[key].content.forEach(s => ls.push(s));
        }
        return ls;
    }

    public get size() {
        if (this.ContainsChords)
            throw new Error("Invalid format for .size");
        return Object.values(this.content as LyricsContent)[0].content.length;
    }
}
