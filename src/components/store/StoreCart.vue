<template>
    <modal
        theme="primary"
        :label="$t('store.checkout')"
        v-if="cartItems.length" 
        icon="buy"
    >
        <h3>{{ $t('store.inCart')}}</h3>
        <span @click="clearCart">{{ $t('store.clearCart') }}</span>
        <p v-for="i in cartItems" :key="i.id">
            {{i.getName(languageKey)}}
        </p>
        <base-button
            @click="checkout"
        >
            {{ $t('store.checkout') }}
        </base-button>
    </modal>
</template>
<script lang="ts">
import { Modal, BaseButton } from "@/components";
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { Options, Vue } from "vue-class-component";

@Options({
    components: {
        Modal,
        BaseButton,
    },
    name: "store-cart",
})
export default class StoreCart extends Vue {
    private store = useStore();

    public get cartItems() {
        return this.store.getters.cartItems;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public async checkout() {
        await this.store.dispatch(StripeActionTypes.START_SESSION);
    }

    public clearCart() {
        this.store.commit(StripeMutationTypes.CART_CLEAR);
    }
}
</script>
