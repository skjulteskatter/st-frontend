import { ITheme } from "songtreasures-api";
import BaseItem from "./base";

export default class Theme extends BaseItem implements ITheme {
    constructor(i: ITheme) {
        super(i);
    }
}
