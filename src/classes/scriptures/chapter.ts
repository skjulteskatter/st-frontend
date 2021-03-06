import router from "@/router";
import { IChapter } from "songtreasures-api";
import Verse from "./verse";

export default class Chapter implements IChapter {
    public id;
    public updatedAt;
    public bookId;
    public number;
    public title;
    public preview;
    public verses: Verse[] | null;

    constructor(i: IChapter) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.bookId = i.bookId;
        this.number = i.number;
        this.title = i.title;
        this.preview = i.preview ?? null;
        this.verses = i.verses ? i.verses.map(v => new Verse(v)) : null;
    }

    public view() {
        router.push({
            name: "chapter-view",
            params: {
                chapterId: this.number,
            },
        });
    }
}
