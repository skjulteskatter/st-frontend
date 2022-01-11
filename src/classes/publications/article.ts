import { appSession } from "@/services/session";
import { IArticle } from "songtreasures-api/publications";
import ArticleContent from "./articleContent";

export default class Article implements IArticle {
    public id: string;
    public updatedAt: string;
    public publicationId: string;
    public authorId: string;
    public dateWritten: string;
    public icon: string;
    public image: string;
    public title: string;
    public content;

    public get Date() {
        return new Date(this.dateWritten);
    }

    public get Author() {
        return appSession.contributors.find(c => c.id === this.authorId) ?? null;
    }

    constructor(i: IArticle) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.publicationId = i.publicationId;
        this.authorId = i.authorId;
        this.dateWritten = i.dateWritten;
        this.icon = i.icon;
        this.image = i.image;
        this.title = i.title;
        this.content = i.content ? new ArticleContent(i.content) : null;
    }
}
