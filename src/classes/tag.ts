import { ApiTag } from "dmb-api";

export class Tag implements ApiTag {
    public id;
    public userId;
    public canEdit;
    public name;
    public songIds;
    public type;
    public color;

    constructor(i: ApiTag) {
        this.id = i.id;
        this.userId = i.userId;
        this.canEdit = i.canEdit;
        this.name = i.name;
        this.songIds = i.songIds;
        this.type = i.type;
        this.color = i.color;
    }
    
    public getName() {
        return this.name;
    }
}
