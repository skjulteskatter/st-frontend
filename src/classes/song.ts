import api from "@/services/api";
import { Lyrics } from ".";

export class Song implements SongInterface {
    public number = 0;
    public collection: Collection = {} as Collection;
    public name: {
        [languageKey: string]: string;
    } = {};
    public authors: Contributor[] = []
    public composers: Contributor[] = [];
    public leadSheetUrl = "";
    public yearWritten = 0;
    public originCountry: Country = {} as Country;
    public soundFiles: MediaFile[] = [];
    public videoFiles: MediaFile[] = [];
    public biography: MediaFile = {} as MediaFile;
    public melodyOrigin = {};

    private _api = api;

    public search(text: string): boolean {
        for (const key in Object.keys(this.name)) {
            if (this.name[key].includes(text)) return true;
        }

        return false;
    }

    public language(code: string): boolean {
        if (Object.keys(this.name).includes(code)) return true;

        return false;
    }

    public async lyrics(languageCode: string): Promise<Lyrics> {
        return await this._api.songs.getLyrics(this.collection.key, this.number, languageCode, "json", 0);
    }
}
