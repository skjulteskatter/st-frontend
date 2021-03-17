import { ApiContributorCollectionItem } from "dmb-api";
import { Contributor } from "../contributor";
import { Song } from "../song";

export class ContributorCollectionItem {
    public contributor: Contributor;
    public songs: Song[];
    public songIds: string[];


    constructor(c: ApiContributorCollectionItem) {
        this.contributor = new Contributor(c.contributor);
        this.songs = c.songs?.map(s => new Song(s));
        this.songIds = c.songIds;
    }
}