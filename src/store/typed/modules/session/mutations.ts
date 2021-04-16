import { Collection } from "@/classes";
import { ApiActivity, ApiPlaylist } from "dmb-api";
import { MutationTree } from "vuex";
import { SessionMutationTypes } from "./mutation-types";
import { State } from "./state";


export type Mutations<S = State> = {
    [SessionMutationTypes.SET_USER](state: S, payload: User): void;
    [SessionMutationTypes.CLEAR_SESSION](state: S): void;
    [SessionMutationTypes.SET_SETTINGS](state: S, payload: UserSettings): void;
    [SessionMutationTypes.SET_LANGUAGES](state: S, payload: Language[]): void;

    [SessionMutationTypes.SET_LOG_ITEMS](state: S, payload: ApiActivity[]): void;
    [SessionMutationTypes.CLEAR_LOGS](state: S): void;

    [SessionMutationTypes.COLLECTION](state: S, payload: Collection): void;
    [SessionMutationTypes.COLLECTIONS](state: S, payload: Collection[]): void;

    [SessionMutationTypes.SET_PLAYLISTS](state: S, payload: ApiPlaylist[]): void;
    [SessionMutationTypes.SET_PLAYLIST](state: S, payload: ApiPlaylist): void;
    [SessionMutationTypes.DELETE_PLAYLIST](state: S, payload: string): void;
    [SessionMutationTypes.UPDATE_PLAYLIST](state: S, payload: ApiPlaylist): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [SessionMutationTypes.SET_USER](state: State, user: User): void {
        state.currentUser = user;
        if (user.settings?.languageKey) localStorage.setItem("languageKey", user.settings.languageKey);
    },
    [SessionMutationTypes.CLEAR_SESSION](state: State): void {
        state.currentUser = undefined;
    },
    [SessionMutationTypes.SET_SETTINGS](state, settings): void {
        if (state.currentUser) {
            state.currentUser.settings = settings;
        }
    },
    [SessionMutationTypes.SET_LANGUAGES](state, languages: Language[]): void {
        state.languages = languages;
    },

    [SessionMutationTypes.SET_LOG_ITEMS](state, value: ApiActivity[]): void {
        state.activities = state.activities.slice(0, 10 - value.length); 
        state.activities.push(...value);
        state.activities = state.activities.sort((a, b) => new Date(b.loggedDate).getTime() - new Date(a.loggedDate).getTime());
    },
    [SessionMutationTypes.CLEAR_LOGS](state): void {
        state.activities = [];
    },
    [SessionMutationTypes.COLLECTION](state, collection: Collection): void {
        const c = state.collections.find(c => c.id == collection.id);

        if (c) {
            state.collections[state.collections.indexOf(c)] = collection;
        } else {
            state.collections.push(collection);
        }
    },
    [SessionMutationTypes.COLLECTIONS](state, collections: Collection[]): void {
        state.collections = collections;
    },
    [SessionMutationTypes.SET_PLAYLISTS](state, playlists: ApiPlaylist[]): void {
        state.playlists = playlists;
    },
    [SessionMutationTypes.SET_PLAYLIST](state, playlist: ApiPlaylist): void {
        state.playlists.push(playlist);
    },
    [SessionMutationTypes.DELETE_PLAYLIST](state, id: string): void {
        const playlist = state.playlists.find(p => p.id == id);
        if (!playlist) return;

        state.playlists.splice(state.playlists.indexOf(playlist), 1);
    },
    [SessionMutationTypes.UPDATE_PLAYLIST](state, playlist: ApiPlaylist): void {
        const pl = state.playlists.find(p => p.id == playlist.id);
        if (pl) {
            pl.entries = playlist.entries;
            pl.name = playlist.name;
        }
    },
};
