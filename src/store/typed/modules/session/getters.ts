import { Collection } from "@/classes";
import { RootState } from "@/store/typed";
import { GetterTree } from "vuex";
import { State } from "./state";


export type Getters = {
    collections(state: State): Collection[];
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
};
