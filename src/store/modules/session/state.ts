import { Collection } from "@/classes";
import { ApiActivity, ApiPlaylist } from "dmb-api";

export type State = {
    currentUser?: User;
    languages: Language[];
    initialized: boolean;
    collections: Collection[];
    extend: boolean;
    error: string;
    playlists: ApiPlaylist[];
    activities?: ApiActivity[];
    redirect?: string;
};

export const state: State = {
    languages: [],
    initialized: false,
    collections: [],
    extend: false,
    error: "",
    playlists: [],
};
