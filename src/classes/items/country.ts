import { ApiCountry } from "dmb-api";
import BaseItem from "./base";

export default class Country extends BaseItem implements ApiCountry {
    public countryCode;

    constructor(i: ApiCountry) {
        super(i);
        this.countryCode = i.countryCode;
    }
}
