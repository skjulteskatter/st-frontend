import type { IActivity, ICustomCollection, ITag } from "songtreasures-api";

export type State = {
    initialized: boolean;
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
    error: "",
    playlists: [],
    tags: [],
};
