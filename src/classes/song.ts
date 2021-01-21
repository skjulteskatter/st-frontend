import showdown from 'showdown';
import ContributorItem from './contributor';
const converter = new showdown.Converter();

export class Song implements SongInterface {
    public number = 0;
    public type: string;
    public name: {
        [languageKey: string]: string;
    } = {};
    public authors: ContributorItem[] = []
    public composers: ContributorItem[] = [];
    public leadSheetUrl = "";
    public yearWritten = 0;
    public originCountry: Country = {} as Country;
    public soundFiles: MediaFile[] = [];
    public videoFiles: MediaFile[] = [];
    public details: {
        [languageKey: string]: string;
    } = {};
    public melodyOrigin = {} as Origin;
    public collection: Collection = {} as Collection;

    constructor(song: SongInterface, contributors: ContributorCollectionItem[]) {
        this.number = song.number;
        this.name = song.name;
        this.authors = song.authors.map(a => new ContributorItem(contributors.find(c => c.contributor.internalId == a.internalId)?.contributor ?? {} as Contributor)).filter(c => c.internalId);
        this.composers = song.composers.map(a => new ContributorItem(contributors.find(c => c.contributor.internalId == a.internalId)?.contributor ?? {} as Contributor)).filter(c => c.internalId);
        this.leadSheetUrl = song.leadSheetUrl;
        this.yearWritten = song.yearWritten;
        this.originCountry = song.originCountry;
        this.soundFiles = song.soundFiles;
        this.videoFiles = song.videoFiles;
        this.details = song.details;
        this.melodyOrigin = song.melodyOrigin;
        this.type = song.type;
    }

    public language(code: string): boolean {
        if (Object.keys(this.name).includes(code)) return true;

        return false;
    }

    public get description() {

        const contents: {
            [key: string]: string;
        } = {};

        for (const key of Object.keys(this.details)) {
            contents[key] = converter.makeHtml(this.details[key]);
        }

        return contents;
    }
}
