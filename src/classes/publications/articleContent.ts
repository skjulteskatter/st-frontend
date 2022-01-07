import { IArticleContent } from "songtreasures-api/publications";

export default class ArticleContent implements IArticleContent {
    public articleId: string;
    public translationId: string | null;
    public translatorId: string | null;
    public updatedAt: string;
    public language: string;
    public introduction: string;
    public content: string;

    constructor(i: IArticleContent) {
        this.articleId = i.articleId;
        this.translationId = i.translationId;
        this.translatorId = i.translatorId;
        this.updatedAt = i.updatedAt;
        this.language = i.language;
        this.introduction = i.introduction;
        this.content = i.content;
    }
}
