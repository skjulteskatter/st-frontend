export class Lyrics implements LyricsInterface {
    number: number;
    title: string;
    collectionKey: string;
    content: {
        [key: string]: {
            name: string;
            content: string[];
        };
    };
    format: string;
    hasChords: boolean;
    language: Language;
    originalKey: string;
    transposedToKey?: string;

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
                name: this.content[key].name,
                content: this.content[key].content,
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
            for (const line of this.content[key].content) {
                lines.push(line);
            }
        }

        return lines.join('\n').replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
    }
}