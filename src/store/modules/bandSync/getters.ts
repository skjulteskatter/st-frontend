import { GetterTree } from "vuex";
import type { RootState } from "../..";
import { State } from "./state";

export type Getters = {
    isActive(state: State): boolean;
};

export const getters: GetterTree<State, RootState> & Getters = {
    isActive(state) {
        return state.role !== "none" && state.code != null;
    },
};
