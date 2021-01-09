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
            number: number;
            type: string;
            name: string;
            content: string[];
        }[] = [];

        let chorus = undefined;

        for (const key of Object.keys(this.content)) {
            const verse = {
                number: parseInt(key.split('_')[1]),
                type: key.split('_')[0],
                name: this.content[key].name,
                content: this.content[key].content,
            }
            
            if (verse.type == "chorus") {
                verses.push(Object.assign({}, verse))
                if (chorus) {
                    verse.number = chorus.number + 1;
                    verse.name = chorus.name + "_2";
                }
                chorus = verse;
            } else {
                verses.push(verse);
                if (chorus !== undefined) {
                    chorus.number++;
                    verses.push(Object.assign({}, chorus));
                }
            }
        }
        return verses;
    }
}