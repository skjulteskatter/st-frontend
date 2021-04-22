import { Collection, Product } from "@/classes";
import stripeService from "@/services/stripe";
import { ActionContext, ActionTree } from "vuex";
import { RootState } from "../..";
import { StripeActionTypes } from "./action-types";
import { StripeMutationTypes } from "./mutation-types";
import { Mutations } from "./mutations";
import { State } from "./state";

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
    [StripeActionTypes.GET_PORTAL](): Promise<string>;
    [StripeActionTypes.SETUP]({ commit }: AugmentedActionContext, collections: Collection[]): Promise<void>;
    [StripeActionTypes.START_SESSION]({ state }: AugmentedActionContext): Promise<void>;
    [StripeActionTypes.REFRESH_COLLECTIONS](): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [StripeActionTypes.GET_PORTAL]() {
        return await stripeService.portal();
    },
    async [StripeActionTypes.SETUP]({ commit }, collections: Collection[]) {
        const result = await stripeService.setup();
        await stripeService.init(result.key);
        
        commit(StripeMutationTypes.SET_KEY, result.key);
        commit(StripeMutationTypes.SET_PRODUCTS, result.products.map(p => new Product(p, collections)));
    },
    // eslint-disable-next-line no-empty-pattern
    async [StripeActionTypes.START_SESSION]({ state }) {
        if (state.cart.length > 0) await stripeService.checkout(state.cart);
    },
    async [StripeActionTypes.REFRESH_COLLECTIONS]() {
        await stripeService.refreshSubscriptions();
    },
};
