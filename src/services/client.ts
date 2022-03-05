import config from "@/config";
import { Client } from "hiddentreasures-js";
import auth from "./auth";

export default new Client({
    basePath: config.api.basePath,
    apiVersion: "4.0",
    getToken: async () => await auth.getToken() as string,
});
