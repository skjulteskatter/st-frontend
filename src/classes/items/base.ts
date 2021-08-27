import { ApiItem } from "dmb-api";

export default class BaseItem implements ApiItem {
    public id;
    public name;

    constructor(i: ApiItem) {
        this.id = i.id;
        this.name = i.name;
    }
}
