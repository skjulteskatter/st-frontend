import { Collection } from "@/classes";
import { RootState } from "../..";
import { GetterTree } from "vuex";
import { State } from "./state";


export type Getters = {
    collection(state: State): Collection | undefined;
}

export const getters: GetterTree<State, RootState> & Getters = {
    collection(state): Collection | undefined {
        return state.collectionId ? state.collections.find(c => c.id == state.collectionId || c.getKeys().includes(state.collectionId as string)) : undefined;
    },
};
