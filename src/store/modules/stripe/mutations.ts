
import { Product } from "@/classes";
import { MutationTree } from "vuex";
import { StripeMutationTypes } from "./mutation-types";
import { State } from "./state";


export type Mutations<S = State> = {
    [StripeMutationTypes.SET_KEY](state: S, payload: string): void;
    [StripeMutationTypes.SET_PRODUCTS](state: S, payload: Product[]): void;
    [StripeMutationTypes.CART_ADD_PRODUCT](state: S, payload: string): void;
    [StripeMutationTypes.CART_REMOVE_PRODUCT](state: S, payload: string): void;
    [StripeMutationTypes.CART_CLEAR](state: S): void;
    [StripeMutationTypes.CART_SHOW](state: S, payload: boolean): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [StripeMutationTypes.SET_KEY](state, key: string): void {
        state.publicKey = key;
        state.initialized = true;
    },
    [StripeMutationTypes.SET_PRODUCTS](state, products): void {
        state.products = products;
    },
    [StripeMutationTypes.CART_ADD_PRODUCT](state, payload) {
        if (!state.cart.includes(payload)) state.cart.push(payload);
    },
    [StripeMutationTypes.CART_REMOVE_PRODUCT](state, payload) {
        state.cart = state.cart.filter(p => p != payload);
    },
    [StripeMutationTypes.CART_CLEAR](state) {
        state.cart = [];
    },
    [StripeMutationTypes.CART_SHOW](state, payload)  {
        state.showCart = payload;
    },
};
