import { ICategory } from "songtreasures-api";
import BaseItem from "./base";

export default class Category extends BaseItem implements ICategory {
    constructor(i: ICategory) {
        super(i);
    }
}
