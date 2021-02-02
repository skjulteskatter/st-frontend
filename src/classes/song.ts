import showdown from 'showdown';
import Contributor from './contributor';
import ContributorItem from './contributor';
const converter = new showdown.Converter();

export class Song implements SongInterface {
    public id: string;
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
    public audioFiles: MediaFile[] = [];
    public videoFiles: MediaFile[] = [];
    public details: {
        [languageKey: string]: string;
    } = {};
    public melodyOrigin = {} as Origin;

    constructor(song: SongInterface, contributors: Contributor[]) {
        this.id = song.id;
        this.number = song.number;
        this.name = song.name;
        this.authors = contributors.filter(c => song.authors.map(a => a.id).includes(c.id));
        this.composers = contributors.filter(c => song.composers.map(a => a.id).includes(c.id));
        this.leadSheetUrl = song.leadSheetUrl;
        this.yearWritten = song.yearWritten;
        this.originCountry = song.originCountry;
        this.audioFiles = song.audioFiles;
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

    public get rawContributorNames() {
        const names: string[] = [];

        this.authors.forEach(a => {
            names.push(a.name.toLowerCase());
        });

        this.composers.forEach(c => {
            names.push(c.name.toLowerCase());
        });

        return names.join('').replace(/[^0-9a-zA-Z]/g, '');
    }
}
