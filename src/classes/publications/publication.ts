import { IPublication } from "songtreasures-api/publications";
import LocaleString from "../localeString";

export default class Publication implements IPublication {
    public id: string;
    public collectionId: string;
    public updatedAt: string;
    public datePublished: string;
    public title: string;
    public key;
    public description: string;
    public icon: string;
    public image: string;

    constructor(i: IPublication) {
        this.id = i.id;
        this.collectionId = i.collectionId;
        this.updatedAt = i.updatedAt;
        this.datePublished = i.datePublished;
        this.title = i.title;
        this.key = new LocaleString(i.key);
        this.description = i.description;
        this.icon = i.icon;
        this.image = i.image;
    }
}
