import { ApiTheme } from "dmb-api";
import BaseItem from "./base";

export default class Theme extends BaseItem implements ApiTheme {
    constructor(i: ApiTheme) {
        super(i);
    }
}
