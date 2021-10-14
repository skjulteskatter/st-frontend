import { User } from "@/classes";
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
    splash?: {
        title: string;
        content: string;
        callback?: () => Promise<void>;
    };
    favorites: string[];
};

export const state: State = {
    initialized: false,
    extend: false,
    error: "",
    playlists: [],
    tags: [],
    favorites: [],
};
