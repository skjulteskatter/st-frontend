import { Collection, Contributor, Song } from "@/classes";
import { RootState } from "../..";
import { GetterTree } from "vuex";
import { State } from "./state";
import { ApiActivity, ApiContributor, ApiPlaylist, ApiSong } from "dmb-api";
import { Activity } from "@/classes/activity";


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
}

export const getters: GetterTree<State, RootState> & Getters = {
    allCollections(state): Collection[] {
        return state.collections;
    },
    collections(state): Collection[] {
        if (state.currentUser) {
            return state.collections;
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
            if (a.type == "contributor") {
                item.item = new Contributor(a.item as ApiContributor);
            } else if (a.type == "song") {
                item.item = new Song(a.item as ApiSong);
            }

            return new Activity(item);
        }) ?? [];
    },
};
