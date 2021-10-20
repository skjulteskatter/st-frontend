import { IGenre } from "songtreasures";
import BaseItem from "./base";

export default class Genre extends BaseItem implements IGenre {
    public description;

    constructor(i: IGenre) {
        super(i);
        this.description = i.description;
    }
}
