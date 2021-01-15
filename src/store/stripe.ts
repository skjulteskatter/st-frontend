import stripeService from "@/services/stripe";
import { SetupResponseCollection } from "checkout";
import { InjectionKey } from "vue";
import { createStore } from "vuex";

export interface StripeStore {
    products: {
        name: string;
        id: string;
    }[];
    publicKey: string;
    initialized: boolean;
}

export const stripeKey: InjectionKey<StripeStore> = Symbol();

export const stripeStore = createStore<StripeStore>({
    state: {
        products: [],
        publicKey: '',
        initialized: false
    },
    mutations: {
        setProducts(state, collections: SetupResponseCollection[]) {
            state.products = collections;
        },
        setKey(state, key: string) {
            state.publicKey = key;
            state.initialized = true;
        }
    },
    actions: {
        async setup({ commit }) {
            const result = await stripeService.setup();
            await stripeService.init(result.key);
            
            commit('setKey', result.key);
            commit('setProducts', result.collections);
        },
        async startSession(state, priceId: string) {
            await stripeService.checkout(priceId);
        }
    }
})