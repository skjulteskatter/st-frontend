import config from "@/config";
import { SongTreasures } from "hiddentreasures-js";
import auth from "./auth";

export default new SongTreasures({
    basePath: config.api.basePath,
    apiVersion: "4.0",
    getToken: async () => await auth.getToken() as string,
});
