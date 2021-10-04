import { Collection } from "@/classes";
import { RootState } from "../..";
import { GetterTree } from "vuex";
import { State } from "./state";
import { ApiActivity, ApiPlaylist } from "dmb-api";
import { Activity } from "@/classes/activity";
import { appSession } from "@/services/session";
import { User } from "@/classes/user";


export type Getters = {
    allCollections(state: State): Collection[];
    collections(state: State): Collection[];
    user(state: State): User | undefined;
    initialized(state: State): boolean;
    isAdmin(state: State): boolean;
    languageKey(state: State): string;
    extended(state: State): boolean;
    playlists(state: State): ApiPlaylist[];
    activities(state: State): Activity[];
    favorites(state: State): string[];
}

export const getters: GetterTree<State, RootState> & Getters = {
    allCollections(): Collection[] {
        return appSession.collections;
    },
    collections(state): Collection[] {
        if (state.currentUser) {
            return appSession.collections;
            // if (state.currentUser.roles.some(r => ["administrator", "extended"].includes(r))) {
            //     return state.collections;
            // }
            // const subscriptions = state.currentUser.subscriptions;
            // return state.collections.filter(c => subscriptions
            //     .map(s => s.collectionIds)
            //     .some(i => i.includes(c.id)));
        } else {
            return [];
        }
    },
    user(state) {
        return state.currentUser;
    },
    initialized(state) {
        return state.initialized;
    },
    isAdmin(state): boolean {
        return state.currentUser?.roles.includes("administrator") == true;
    },
    languageKey(state): string {
        return state.currentUser?.settings?.languageKey ?? "en";
    },
    extended(state): boolean {
        return state.currentUser?.roles.some(r => r == "administrator" || r == "extended") == true;
    },
    playlists(state): ApiPlaylist[] {
        return state.playlists;
    },
    activities(state) {
        return state.activities?.map(a => {
            const item: ApiActivity = {
                id: a.id,
                type: a.type,
                itemId: a.itemId,
                loggedDate: a.loggedDate,
            };
            return new Activity(item);
        }) ?? [];
    },
    favorites(state): string[] {
        return state.favorites;
    },
};
