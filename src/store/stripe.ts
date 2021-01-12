import { SetupResponseCollection } from "checkout";
import { InjectionKey } from "vue";
import { createStore } from "vuex";

interface StripeStore {
    products: {
        name: string;
        id: string;
    }[];
}



export const stripeKey: InjectionKey<StripeStore> = Symbol();

export const stripeStore = createStore<StripeStore>({
    state: {
        products: []
    },
    mutations: {
        setProducts(state, collections: SetupResponseCollection[]) {
            state.products = collections;
        }
    }
})