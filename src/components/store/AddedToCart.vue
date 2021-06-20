<template>
    <base-modal :show="Show" @close="cancel = true">
        <h1 class="text-lg">{{$t('store.addedToCart')}}</h1>
        <div v-for="p in Products" :key="p.id">
            {{p.getName()}}
        </div>
        <base-button theme="tertiary" @click="cancel = true">{{$t('store.continue')}}</base-button>
        <base-button theme="success" @click="checkout" :loading="checkingOut">{{$t('store.checkout')}}</base-button>
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
        return this.store.state.stripe.cart.length == 1 && !this.cancel;
    }
    
    public async checkout() {
        this.checkingOut = true;
        await this.store.dispatch(StripeActionTypes.START_SESSION);
        // this.checkingOut = false;
    }

    public get Products() {
        return this.store.getters.cartItems;
    }
}
</script>
