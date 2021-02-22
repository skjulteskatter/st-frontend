type Content = {
    [key: string]: {
        name: string;
        content: string[];
    };
}

export class Lyrics implements LyricsInterface {
    number: number;
    title: string;
    collectionKey: string;
    content: Content | string;
    format: string;
    hasChords: boolean;
    language: Language;
    originalKey: string;
    transposedToKey: string;
    transpositions: {
        [key: string]: number;
    };

    constructor(lyrics: LyricsInterface) {
        this.number = lyrics.number;
        this.title = lyrics.title;
        this.collectionKey = lyrics.collectionKey;
        this.content = lyrics.content;
        this.format = lyrics.format;
        this.hasChords = lyrics.hasChords;
        this.originalKey = lyrics.originalKey;
        this.language = lyrics.language;
        this.transposedToKey = lyrics.transposedToKey;
        this.transpositions = lyrics.transpositions;
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
            }

            if (type == "chorus") {
                if (chorus.name) {
                    number--;
                }
                verses[number] = verse;
                number++
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

        for (const key of Object.keys(this.content)) {
            for (const line of (this.content as JsonContent)[key].content) {
                lines.push(line);
            }
        }

        return lines.join('\n').replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
    }

    public get transposedContent() {
        return this.content as string;
    }

    public get currentKey() {
        

        return '';
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