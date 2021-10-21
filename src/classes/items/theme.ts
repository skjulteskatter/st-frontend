import { ITheme } from "songtreasures";
import BaseItem from "./base";

export default class Theme extends BaseItem implements ITheme {
    constructor(i: ITheme) {
        super(i);
    }
}
