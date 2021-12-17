import { ICopyright } from "songtreasures-api";
import BaseItem from "./base";

export default class Copyright extends BaseItem implements ICopyright {
    constructor(i: ICopyright) {
        super(i);
    }
}
