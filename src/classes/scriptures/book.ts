import router from "@/router";
import { IBook } from "songtreasures";
import Chapter from "./chapter";

export default class Book implements IBook {
    public id;
    public updatedAt;
    public translationId;
    public title;
    public shortTitle;
    public number;
    public color;
    public chapters;

    constructor(i: IBook) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.translationId = i.translationId;
        this.title = i.title;
        this.shortTitle = i.shortTitle;
        this.number = i.number;
        this.color = i.color;
        this.chapters = i.chapters ? i.chapters.map(c => new Chapter(c)) : null;
    }

    public view() {
        router.push({
            name: "chapter-list",
            params: {
                bookId: this.shortTitle,
            },
        });
    }
}
