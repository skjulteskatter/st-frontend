<template>
    <base-modal :show="Show" @close="cancel = true">
        <div class="flex flex-col gap-4">
            <h3 class="text-lg font-bold">{{$t('store.addedToCart')}}</h3>
            <div class="flex flex-col gap-2">
                <div v-for="p in Products" :key="p.id" class="p-2 rounded bg-black bg-opacity-10 flex justify-between items-center gap-4">
                    <span>{{ p.getName() }}</span>
                    <span class="opacity-50 text-sm">{{ p.priceDiv(languageKey) }}</span>
                </div>
            </div>
            <div class="flex gap-4">
                <base-button theme="tertiary" @click="cancel = true">{{$t('store.continue')}}</base-button>
                <base-button theme="secondary" icon="buy" @click="checkout" :loading="checkingOut">{{$t('store.checkout')}}</base-button>
            </div>
        </div>
    </base-modal>
</template>
<script lang="ts">
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
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

    public get Products() {
        return this.store.getters.cartItems;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
