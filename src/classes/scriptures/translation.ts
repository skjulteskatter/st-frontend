import { ITranslation } from "songtreasures";

export default class Translation implements ITranslation {
    public id;
    public updatedAt;
    public collectionId;
    public title;
    public shortTitle;
    public sourceName;
    public icon;
    public image;
    public language;

    constructor(i: ITranslation) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.collectionId = i.collectionId;
        this.title = i.title;
        this.shortTitle = i.shortTitle;
        this.sourceName = i.sourceName;
        this.icon = i.icon;
        this.image = i.image;
        this.language = i.language;
    }
}
