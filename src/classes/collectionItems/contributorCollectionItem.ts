import { ApiContributorCollectionItem } from "dmb-api";
import { Contributor } from "../contributor";
import { Song } from "../song";
import { BaseCollectionItem } from "./baseCollectionItem";

export class ContributorCollectionItem extends BaseCollectionItem<Contributor> {
    public songs: Song[];
    public songIds: string[];


    constructor(c: ApiContributorCollectionItem) {
        super();
        this.item = new Contributor(c.contributor);
        this.songs = c.songs?.map(s => new Song(s));
        this.songIds = c.songIds;
        this.id = this.item.id;
    }
}
