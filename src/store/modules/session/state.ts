import { User } from "@/classes";
import { IActivity, ICustomCollection, ITag } from "songtreasures-api";

export type State = {
    currentUser?: User;
    initialized: boolean;
    extend: boolean;
    error: string;
    playlists: ICustomCollection[];
    activities?: IActivity[];
    redirect?: string;
    tags: ITag[];
    splash?: {
        title: string;
        content: string;
        callback?: () => Promise<void>;
    };
};

export const state: State = {
    initialized: false,
    extend: false,
    error: "",
    playlists: [],
    tags: [],
};
