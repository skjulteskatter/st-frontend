import contributorService from "@/services/contributorService";
import copyrightService from "@/services/items/copyrightService";
import songService from "@/services/songs/songService";
import { Contributor, Copyright, Song } from "hiddentreasures-js";
import BaseView from "./baseView";

export default class SongView extends BaseView<Song> {
    private _contributors: Contributor[] | null = null;
    public get contributors() {
        if (!this._contributors)
            throw this.notLoaded();
        return this._contributors;
    }

    private _copyrights: Copyright[] | null = null;
    public get copyrights() {
        if (!this._copyrights)
            throw this.notLoaded();
        return this._copyrights;
    }

    protected async doLoad() {
        if (!this.item) {
            this.item = await songService.get(this.itemId);
        }
        this._contributors = await contributorService.retrieve({
            itemIds: this.item.participants.map(i => i.contributorId),
        });
        this._copyrights = await copyrightService.retrieve({
            itemIds: this.item.copyrights.map(i => i.referenceId),
        });
    }
}
