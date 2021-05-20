import { ApiCollectionItem, ApiContributor, ApiSong } from "dmb-api";
import { Contributor } from "../contributor";
import { BaseCollectionItem } from "./baseCollectionItem";

export class ContributorCollectionItem extends BaseCollectionItem<Contributor> implements ApiCollectionItem<Contributor> {
    public songIds: string[];
    public songs?: ApiSong[];
    
    public get contributor() {
        return this.item;
    }

    constructor(c: ApiCollectionItem<ApiContributor>) {
        super();
        this.item = new Contributor(c.item);
        this.songs = c.songs;
        this.songIds = c.songIds;
        this.id = this.item.id;
        this.fileIds = c.fileIds;
        this.songs = c.songs;
    }
}
