<template>
    <base-modal :show="Show" @close="cancel = true">
        <div class="flex flex-col gap-4">
            <h3 class="text-lg font-bold">{{$t('store.addedToCart')}}</h3>
            <div class="flex flex-col gap-2">
                <div
                    v-for="p in Products"
                    :key="p.id"
                    class="p-2 rounded-md border border-gray-300 flex gap-2"
                >
                    <img
                        :src="p.collections[0].image"
                        alt="collection image"
                        class="rounded h-12 w-12"
                    >
                    <span>
                        <p >{{ p.getName() }}</p>
                        <small class="opacity-50">{{ p.priceDiv(languageKey) }}</small>
                    </span>
                </div>
            </div>
            <div class="flex gap-4 justify-end">
                <base-button theme="tertiary" @click="cancel = true">{{$t('store.continue')}}</base-button>
                <base-button theme="primary" @click="addAllItemsCheckout">{{$t('store.allItems')}}</base-button>
                <base-button theme="secondary" icon="buy" @click="checkout" :loading="checkingOut">{{$t('store.checkout')}}</base-button>
            </div>
        </div>
    </base-modal>
</template>
<script lang="ts">
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { Options, Vue } from "vue-class-component";
import { BaseModal } from "..";

@Options({
    name: "added-to-cart",
    components: {
        BaseModal,
    },
})
export default class AddedToCart extends Vue {
    private store = useStore();
    public cancel = false;
    public checkingOut = false;

    public get Show() {
        return this.store.state.stripe.cart.length == 1 && !this.cancel && this.store.getters.user?.termsAndConditions == true;
    }
    
    public async checkout() {
        this.checkingOut = true;
        await this.store.dispatch(StripeActionTypes.START_SESSION);
        // this.checkingOut = false;
    }

    public async addAllItemsCheckout() {
        this.store.commit(StripeMutationTypes.CART_SET, this.store.getters.products.filter(i => i.collections[0]?.enabled).map(i => i.id));

        await this.checkout();
    }

    public get Products() {
        return this.store.getters.cartItems;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
