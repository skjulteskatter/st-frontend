import { ICountry } from "songtreasures-api";
import BaseItem from "./base";

export default class Country extends BaseItem implements ICountry {
    public countryCode;

    constructor(i: ICountry) {
        super(i);
        this.countryCode = i.countryCode;
    }
}
