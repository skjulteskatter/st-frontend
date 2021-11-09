import router from "@/router";
import { IScripture } from "songtreasures";
import LocaleString from "../localeString";

export default class Scripture implements IScripture {
    public id;
    public updatedAt;
    public title: LocaleString;
    public key: LocaleString;
    public icon;
    public image;

    constructor(i: IScripture) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.title = new LocaleString(i.title ?? {});
        this.key = new LocaleString(i.key ?? {});
        this.icon = i.icon;
        this.image = i.image;
    }

    public view() {
        router.push({
            name: "book-list",
            params: {
                scriptureId: this.id,
            },
        });
    }
}
