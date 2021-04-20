
import { Product } from "@/classes";
import { MutationTree } from "vuex";
import { StripeMutationTypes } from "./mutation-types";
import { State } from "./state";


export type Mutations<S = State> = {
    [StripeMutationTypes.SET_KEY](state: S, payload: string): void;
    [StripeMutationTypes.SET_PRODUCTS](state: S, payload: Product[]): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [StripeMutationTypes.SET_KEY](state, key: string): void {
        state.publicKey = key;
        state.initialized = true;
    },
    [StripeMutationTypes.SET_PRODUCTS](state, products): void {
        state.products = products;
    },
};
