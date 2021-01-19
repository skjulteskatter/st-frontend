export class Song implements SongInterface {
    public number = 0;
    public name: {
        [languageKey: string]: {
            name: string;
            title: string;
        };
    } = {};
    public authors: Contributor[] = []
    public composers: Contributor[] = [];
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

    constructor(song: SongInterface) {
        this.number = song.number;
        this.name = song.name;
        this.authors = song.authors;
        this.composers = song.composers;
        this.leadSheetUrl = song.leadSheetUrl;
        this.yearWritten = song.yearWritten;
        this.originCountry = song.originCountry;
        this.soundFiles = song.soundFiles;
        this.videoFiles = song.videoFiles;
        this.details = song.details;
        this.melodyOrigin = song.melodyOrigin;
    }

    public language(code: string): boolean {
        if (Object.keys(this.name).includes(code)) return true;

        return false;
    }
}
