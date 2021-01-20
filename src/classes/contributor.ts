import { Converter } from 'showdown';
const converter = new Converter();

export default class ContributorItem implements Contributor{
    public biography: {
        [key: string]: string;
    } = {};
    public birthYear = 0;
    public country = '';
    public internalId = '';
    public name = '';

    constructor(contributor: Contributor) {
        this.biography = contributor.biography;
        this.birthYear = contributor.birthYear;
        this.country = contributor.country;
        this.internalId = contributor.internalId;
        this.name = contributor.name;
    }

    public getBiography(language: string) {
        
        const content = this.biography[language] ?? this.biography.no ?? undefined;

        if (content) {
            return converter.makeHtml(content);
        } else {
            return undefined;
        }
    }
}