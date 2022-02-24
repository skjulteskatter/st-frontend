import { ApiContributor } from "songtreasures-api";
import LocaleString from "./localeString";

export default class Contributor implements ApiContributor {
    public id;
    public biography;
    public birthYear = 0;
    public country;
    public name;
    public subtitle;
    public image;

    constructor(contributor: ApiContributor) {
        this.biography = contributor.biography ? new LocaleString(contributor.biography) : undefined;
        this.birthYear = contributor.birthYear;
        this.country = contributor.country;
        this.id = contributor.id;
        this.name = contributor.name;
        this.subtitle = contributor.subtitle;
        this.image = contributor.image;
    }
}
