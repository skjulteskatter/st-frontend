import { RootState } from "../..";
import { GetterTree } from "vuex";
import { State } from "./state";
import { IActivity, ICustomCollection } from "songtreasures-api";
import { Activity } from "@/classes/activity";
import { appSession } from "@/services/session";


export type Getters = {
    initialized(state: State): boolean;
    isAdmin(state: State): boolean;
    languageKey(state: State): string;
    extended(state: State): boolean;
    playlists(state: State): ICustomCollection[];
    activities(state: State): Activity[];
}

export const getters: GetterTree<State, RootState> & Getters = {
    initialized(state) {
        return state.initialized;
    },
    isAdmin(): boolean {
        return appSession.user.roles.includes("administrator") == true;
    },
    languageKey(): string {
        return appSession.Language;
    },
    extended(): boolean {
        return appSession.user.roles.some(r => r == "administrator" || r == "extended") == true;
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
