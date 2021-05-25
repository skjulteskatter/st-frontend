import { ApiActivity, ApiPlaylist, ApiTag } from "dmb-api";

export type State = {
    currentUser?: User;
    languages: Language[];
    initialized: boolean;
    extend: boolean;
    error: string;
    playlists: ApiPlaylist[];
    activities?: ApiActivity[];
    redirect?: string;
    tags: ApiTag[];
};

export const state: State = {
    languages: [],
    initialized: false,
    extend: false,
    error: "",
    playlists: [],
    tags: [],
};
