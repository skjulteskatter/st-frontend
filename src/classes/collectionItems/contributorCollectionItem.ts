import { ApiContributorCollectionItem, ApiSong } from "dmb-api";
import { Contributor } from "../contributor";

export class ContributorCollectionItem {
    public contributor: Contributor;
    public songs: ApiSong[];
    public songIds: string[];


    constructor(c: ApiContributorCollectionItem) {
        this.contributor = new Contributor(c.contributor);
        this.songs = c.songs;
        this.songIds = c.songIds;
    }
}