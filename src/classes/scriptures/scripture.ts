import { IScripture } from "songtreasures";

export default class Scripture implements IScripture {
    public id;
    public updatedAt;
    public title;
    public icon;
    public image;

    constructor(i: IScripture) {
        this.id = i.id;
        this.updatedAt = i.updatedAt;
        this.title = i.title;
        this.icon = i.icon;
        this.image = i.image;
    }
}
