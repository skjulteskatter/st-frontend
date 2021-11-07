import { IChapter } from "songtreasures";
import Verse from "./verse";

export default class Chapter implements IChapter {
    public id;
    public updatedAt;
    public bookId;
    public number;
    public title;
    public verses: Verse[] | null;

    constructor(i: IChapter) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.bookId = i.bookId;
        this.number = i.number;
        this.title = i.title;
        this.verses = i.verses ? i.verses.map(v => new Verse(v)) : null;
    }
}
