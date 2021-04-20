import { Product } from "@/classes";
import { GetterTree } from "vuex";
import { RootState } from "../..";
import { State } from "./state";

export type Getters = {
    products(state: State): Product[];
    stripeInitialized(state: State): boolean;
}

export const getters: GetterTree<State, RootState> & Getters = {
    products(state) {
        return state.products;
    },
    stripeInitialized(state) {
        return state.initialized;
    },
};
