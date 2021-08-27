import { ApiCopyright } from "dmb-api";
import BaseItem from "./base";

export default class Copyright extends BaseItem implements ApiCopyright {
    constructor(i: ApiCopyright) {
        super(i);
    }
}
