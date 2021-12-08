import { Collection } from "@/classes";
import { ICollection } from "songtreasures";
import api from "../api";
import { appSession } from "../session";
import BaseModule from "./baseModule";

class Collections extends BaseModule<Collection, ICollection> {
    retrieveFromSource = (id: string) => () => api.collections.get(id);
    retrieveAllFromSource = () => () => api.collections.list();

    convert = (i: ICollection) => {
        return new Collection(i);
    }

    id = (i: ICollection, query: string) => i.id === query || Object.values(i.keys).includes(query);

    override async get(id: string) {
        const collection = await super.get(id);

        await collection.load(appSession.Language);

        return collection;
    }
}

export default new Collections("collections");
