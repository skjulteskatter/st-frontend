import { Publication } from "@/classes/publications";
import Article from "@/classes/publications/article";
import { publications } from "../api";
import { appSession } from "../session";

class PublicationService {
    protected publications: Publication[] = [];
    /** used for single cache */
    private _publications: {
        [key: string]: Publication;
    } = {};

    public async get(id: string) {
        return this._publications[id] ?? 
            (this._publications[id] = 
                (this.publications.find(i => i.id === id) 
                ?? new Publication(await publications.get(id)))
            );
    }

    public async list(parentId: string) {
        const collection = appSession.getCollection(parentId);
        if (!collection) {
            throw new Error("Collection not found");
        }
        if (!this.publications.some(p => p.collectionId === collection.id)) {
            this.publications.push(...(await publications.list(collection.id)).map(i => new Publication(i)));
        }
        return this.publications.filter(p => p.collectionId === collection.id);
    }

    public articles = new ArticleService(this);
}

class ArticleService {
    private _parent;
    constructor(parent: PublicationService) {
        this._parent = parent;
    }

    protected articles: Article[] = [];
    /** used for single cache */
    private _articles: {
        [key: string]: Article;
    } = {};

    private _language: string | null = null;

    public get language() {
        return this._language ?? appSession.Language;
    }
    public set language(v) {
        this._language = v;
    }

    public async get(id: string) {
        return this._articles[id] ?? 
            (this._articles[id] = 
                (this.articles.find(i => i.id === id) 
                ?? new Article(await publications.articles.get(id, true, this.language)))
            );
    }

    public async list(publicationId: string) {
        const publication = await this._parent.get(publicationId);
        if (!this.articles.some(a => a.publicationId === publication.id)) {
            this.articles.push(...(await publications.articles.list(publication.id, true, this.language)).map(a => new Article(a)));
        }
        return this.articles.filter(a => a.publicationId === publication.id);
    }
}

export default new PublicationService();
