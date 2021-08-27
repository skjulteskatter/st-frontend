import { ApiCategory } from "dmb-api";
import BaseItem from "./base";

export default class Category extends BaseItem implements ApiCategory {
    constructor(i: ApiCategory) {
        super(i);
    }
}
