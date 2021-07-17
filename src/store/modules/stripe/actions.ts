import { Product } from "@/classes";
import i18n from "@/i18n";
import { appSession } from "@/services/session";
import stripeService from "@/services/stripe";
import { ActionContext, ActionTree } from "vuex";
import { RootState, useStore } from "../..";
import { SessionMutationTypes } from "../session/mutation-types";
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
    [StripeActionTypes.SETUP]({ commit }: AugmentedActionContext): Promise<void>;
    [StripeActionTypes.START_SESSION]({ state }: AugmentedActionContext): Promise<void>;
    [StripeActionTypes.REFRESH_COLLECTIONS](): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [StripeActionTypes.GET_PORTAL]() {
        return await stripeService.portal();
    },
    async [StripeActionTypes.SETUP]({ commit }) {
        await appSession.init();
        const result = await stripeService.setup();
        await stripeService.init(result.key);
        
        commit(StripeMutationTypes.SET_KEY, result.key);
        commit(StripeMutationTypes.SET_PRODUCTS, result.products.map(p => new Product(p, appSession.collections)));
    },
    // eslint-disable-next-line no-empty-pattern
    async [StripeActionTypes.START_SESSION]({ state }) {
        const user = useStore().getters.user;

        const fun = async () => {
            if (state.cart.length > 0) await stripeService.checkout(state.cart, state.type);
        };

        if (user && user.email.endsWith("@privaterelay.appleid.com")) {
            useStore().commit(SessionMutationTypes.SPLASH, {
                content: i18n.global.t("store.privateRelayUsed").replace("%0", user.email),
                title: "Private Relay",
                callback: fun,
            });
        } else {
            await fun();
        }
    },
    async [StripeActionTypes.REFRESH_COLLECTIONS]() {
        await stripeService.refreshSubscriptions();
    },
};
