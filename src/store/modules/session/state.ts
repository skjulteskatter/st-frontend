import { ApiActivity, ApiPlaylist, ApiTag } from "dmb-api";

export type State = {
    currentUser?: User;
    initialized: boolean;
    extend: boolean;
    error: string;
    playlists: ApiPlaylist[];
    activities?: ApiActivity[];
    redirect?: string;
    tags: ApiTag[];
};

export const state: State = {
    initialized: false,
    extend: false,
    error: "",
    playlists: [],
    tags: [],
};
