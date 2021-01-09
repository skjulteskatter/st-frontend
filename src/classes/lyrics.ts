export class Lyrics implements LyricsInterface {
    collection: Collection;
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
    song: SongInterface;

    constructor(lyrics: LyricsInterface) {
        this.collection = lyrics.collection;
        this.content = lyrics.content;
        this.format = lyrics.format;
        this.hasChords = lyrics.hasChords;
        this.originalKey = lyrics.originalKey;
        this.language = lyrics.language;
        this.transposedToKey = lyrics.transposedToKey;
        this.song = lyrics.song;
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
}