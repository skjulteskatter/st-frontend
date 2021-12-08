import { CustomCollection } from "@/classes";
import { ICustomCollection } from "songtreasures";
import api from "../api";
import BaseCustomModule from "./baseCustomModule";

type CreateOptions = {
    name: string;
}

class CustomCollections extends BaseCustomModule<CustomCollection, ICustomCollection, CreateOptions> {
    retrieveFromSource = (id: string) => () => api.playlists.getPlaylist(id);
    retrieveAllFromSource = () => () => api.playlists.getPlaylists();

    convert = (i: ICustomCollection) => {
        return new CustomCollection(i);
    }

    create = async (i: CreateOptions) => new CustomCollection(await api.playlists.createPlaylist(i.name));
}

export default new CustomCollections("custom_collections");
