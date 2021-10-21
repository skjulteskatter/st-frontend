import { Collection, User } from "@/classes";
import { RootState } from "../..";
import { GetterTree } from "vuex";
import { State } from "./state";
import { IActivity, ICustomCollection } from "songtreasures";
import { Activity } from "@/classes/activity";
import { appSession } from "@/services/session";


export type Getters = {
    allCollections(state: State): Collection[];
    collections(state: State): Collection[];
    user(state: State): User | undefined;
    initialized(state: State): boolean;
    isAdmin(state: State): boolean;
    languageKey(state: State): string;
    extended(state: State): boolean;
    playlists(state: State): ICustomCollection[];
    activities(state: State): Activity[];
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
    playlists(state): ICustomCollection[] {
        return state.playlists;
    },
    activities(state) {
        return state.activities?.map(a => {
            const item: IActivity = {
                id: a.id,
                type: a.type,
                itemId: a.itemId,
                loggedDate: a.loggedDate,
            };
            return new Activity(item);
        }) ?? [];
    },
};
