import router from "@/router";
import { ITranslation } from "songtreasures";

export default class Translation implements ITranslation {
    public id;
    public updatedAt;
    public scriptureId;
    public title;
    public shortTitle;
    public sourceName;
    public icon;
    public image;
    public language;

    constructor(i: ITranslation) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.scriptureId = i.scriptureId;
        this.title = i.title;
        this.shortTitle = i.shortTitle;
        this.sourceName = i.sourceName;
        this.icon = i.icon;
        this.image = i.image;
        this.language = i.language;
    }

    public view() {
        router.push({
            name: "translation-view",
            params: {
                id: this.id,
            },
        });
    }
}
