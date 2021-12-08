import { Tag } from "@/classes";
import { ITag } from "songtreasures";
import api from "../api";
import BaseCustomModule from "./baseCustomModule";

type CreateOptions = {
    name: string;
    color: string;
    songId: string;
}

class CustomTags extends BaseCustomModule<Tag, ITag, CreateOptions> {
    retrieveFromSource = (id: string) => () => api.tags.get(id);
    retrieveAllFromSource = () => () => api.tags.getAll();

    convert = (i: ITag) => {
        return new Tag(i);
    }

    create = async (i: CreateOptions) => this.convert(await api.tags.create(i.name, i.color, i.songId));
}

export default new CustomTags("tags");
