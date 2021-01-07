import api from "./api";
import { SongCollectionService } from "./songCollection";

export class SongService {
    public HV = new SongCollectionService();
    public MB = new SongCollectionService();
    public RB = new SongCollectionService();
    public collections: Collection[] = [];

    public async init() {
        this.collections = await api.songs.getCollections();

        const hv = this.collections.find(c => c.key == "HV");
        const mb = this.collections.find(c => c.key == "MB");
        const rb = this.collections.find(c => c.key == "RB");

        if (hv == undefined || mb == undefined || rb == undefined) {
            throw new Error("Collection not valid");
        }

        await this.HV.initialize(hv);
        await this.MB.initialize(mb);
        await this.RB.initialize(rb);
    }
}