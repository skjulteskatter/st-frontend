import { ApiGenre } from "dmb-api";
import BaseItem from "./base";

export default class Genre extends BaseItem implements ApiGenre {
    public description;

    constructor(i: ApiGenre) {
        super(i);
        this.description = i.description;
    }
}
