import { Collection } from "@/classes";
import { RootState } from "../..";
import { GetterTree } from "vuex";
import { State } from "./state";


export type Getters = {
    collections(state: State): Collection[];
    user(state: State): User | undefined;
    initialized(state: State): boolean;
}

export const getters: GetterTree<State, RootState> & Getters = {
    collections(state): Collection[] {
        if (state.currentUser) {
            if (state.currentUser.roles.some(r => ["administrator", "extended"].includes(r))) {
                return state.collections;
            }
            const subscriptions = state.currentUser.subscriptions;
            return state.collections.filter(c => subscriptions
                .map(s => s.collectionIds)
                .some(i => i.includes(c.id)));
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
};
