import { SongCollectionService } from "./songCollection";

class SongService {
    public HV = new SongCollectionService();
    public MB = new SongCollectionService();
    public RB = new SongCollectionService();

    public async init() {
        await this.HV.initialize("HV");
        // await this.MB.initialize("MB");
        // await this.RB.initialize("RB");
    }
}
export const songService = new SongService();
export default songService;