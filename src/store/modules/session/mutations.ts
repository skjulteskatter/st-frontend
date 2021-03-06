import { IActivity, ICustomCollection, ITag } from "songtreasures-api";
import { MutationTree } from "vuex";
import { SessionMutationTypes } from "./mutation-types";
import { State } from "./state";

export type Mutations<S = State> = {
    [SessionMutationTypes.SET_LOG_ITEMS](state: S, payload: IActivity[]): void;
    [SessionMutationTypes.CLEAR_LOGS](state: S): void;

    [SessionMutationTypes.SET_PLAYLISTS](state: S, payload: ICustomCollection[]): void;
    [SessionMutationTypes.SET_PLAYLIST](state: S, payload: ICustomCollection): void;
    [SessionMutationTypes.DELETE_PLAYLIST](state: S, payload: string): void;
    [SessionMutationTypes.UPDATE_PLAYLIST](state: S, payload: ICustomCollection): void;

    [SessionMutationTypes.INITIALIZED](state: S): void;
    [SessionMutationTypes.REDIRECT](state: S, payload: string): void;
    [SessionMutationTypes.EXTEND](state: S, payload: boolean): void;
    [SessionMutationTypes.ERROR](state: S, payload: string): void;
    
    [SessionMutationTypes.SET_TAGS](state: S, payload: ITag[]): void;
    [SessionMutationTypes.SET_TAG](state: S, payload: ITag): void;
    [SessionMutationTypes.DELETE_TAG](state: S, payload: string): void;

    [SessionMutationTypes.SPLASH](state: S, payload?: {title: string; content: string; callback?: () => Promise<void>}): void;
    // [SessionMutationTypes.TAG_ADD_SONG](state: S, payload: {
    //     tagId: string;
    //     songId: string;
    // }): void;
    // [SessionMutationTypes.TAG_REMOVE_SONG](state: S, payload: {
    //     tagId: string;
    //     songId: string;
    // }): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [SessionMutationTypes.SET_LOG_ITEMS](state, value: IActivity[]): void {
        state.activities = state.activities ?? [];
        state.activities = state.activities.slice(0, 20 - value.length); 
        state.activities.push(...value);
        state.activities = state.activities
            .sort((a, b) => new Date(b.loggedDate).getTime() - new Date(a.loggedDate).getTime())
            .reduce((a, b) => a.find(i => i.itemId == b.itemId) || a.length >= 10 ? a : [...a, b], [] as IActivity[]);
    },
    [SessionMutationTypes.CLEAR_LOGS](state): void {
        state.activities = [];
    },
    [SessionMutationTypes.SET_PLAYLISTS](state, playlists: ICustomCollection[]): void {
        state.playlists = playlists;
    },
    [SessionMutationTypes.SET_PLAYLIST](state, playlist: ICustomCollection): void {
        state.playlists.push(playlist);
    },
    [SessionMutationTypes.DELETE_PLAYLIST](state, id: string): void {
        const playlist = state.playlists.find(p => p.id == id);
        if (!playlist) return;

        state.playlists.splice(state.playlists.indexOf(playlist), 1);
    },
    [SessionMutationTypes.UPDATE_PLAYLIST](state, playlist: ICustomCollection): void {
        const pl = state.playlists.find(p => p.id == playlist.id);
        if (pl) {
            pl.entries = playlist.entries;
            pl.name = playlist.name;
        }
    },

    [SessionMutationTypes.INITIALIZED](state): void {
        state.initialized = true;
    },
    [SessionMutationTypes.REDIRECT](state, redirect) {
        state.redirect = redirect;
    },
    [SessionMutationTypes.EXTEND](state, value) {
        state.extend = value;
    },
    [SessionMutationTypes.ERROR](state, value) {
        state.error = value;
    },

    
    [SessionMutationTypes.SET_TAGS](state, tags) {
        state.tags = tags;
    },
    [SessionMutationTypes.SET_TAG](state, p) {
        state.tags = state.tags.filter(t => t.id != p.id);

        state.tags.push(p);
    },
    [SessionMutationTypes.DELETE_TAG](state, tagId) {
        state.tags = state.tags.filter(t => t.id != tagId);
    },
    [SessionMutationTypes.SPLASH](state, payload) {
        state.splash = payload;
    },
};
