import router from "@/router";
import { IScripture } from "songtreasures";
import LocaleString from "../localeString";

export default class Scripture implements IScripture {
    public id;
    public updatedAt;
    public title;
    public icon;
    public image;

    constructor(i: IScripture) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.title = new LocaleString(i.title);
        this.icon = i.icon;
        this.image = i.image;
    }

    public view() {
        router.push({
            name: "scripture-view",
            params: {
                scriptureId: this.id,
            },
        });
    }
}
