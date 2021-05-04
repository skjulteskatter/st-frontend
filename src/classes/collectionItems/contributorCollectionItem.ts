import { ApiContributorCollectionItem, ApiSong } from "dmb-api";
import { Contributor } from "../contributor";
import { BaseCollectionItem } from "./baseCollectionItem";

export class ContributorCollectionItem extends BaseCollectionItem<Contributor> implements ApiContributorCollectionItem {
    public songIds: string[];
    public songs?: ApiSong[];
    
    public get contributor() {
        return this.item;
    }

    constructor(c: ApiContributorCollectionItem) {
        super();
        this.item = new Contributor(c.contributor);
        this.songs = c.songs;
        this.songIds = c.songIds;
        this.id = this.item.id;
        this.fileIds = c.fileIds;
        this.songs = c.songs;
    }
}
