<template>
    <modal
        theme="primary"
        :label="$t('store.inCart')"
        v-if="cartItems.length"
        icon="buy"
    >
        <div class="store-cart">
            <div class="store-cart__header">
                <h3 class="store-cart__title">{{ $t("store.inCart") }}</h3>
                <small @click="clearCart" class="store-cart__clearcart">
                    {{ $t("store.clearCart") }}
                </small>
            </div>
            <div class="store-cart__items">
                <div
                    v-for="i in cartItems"
                    :key="i.id"
                    class="store-cart__item"
                >
                    {{ i.getName(languageKey) }}
                    <small>{{ formatPrices(i.prices, "year") }}</small>
                </div>
            </div>
            <base-button @click="checkout" icon="arrowRight">
                {{ $t("store.checkout") }}
            </base-button>
        </div>
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

    public formatPrices(prices: Price[], type: string) {
        const unformattedPrice = prices.find((price) => price.type == type)
            ?.value;
        const formattedPrice = unformattedPrice?.slice(
            0,
            unformattedPrice.length - 2
        );
        return `${formattedPrice} /${type}`;
    }

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

<style lang="scss" scoped>
.store-cart {
    min-width: 30vw;
    min-height: 30vh;
    display: flex;
    flex-direction: column;

    &__header {
        display: flex;
        justify-content: space-between;
    }

    &__title {
        margin-top: 0;
    }

    &__clearcart {
        color: var(--st-color-error);
        cursor: pointer;
    }

    &__items {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: calc(var(--st-spacing) / 2);
    }

    &__item {
        display: flex;
        justify-content: space-between;
        padding: calc(var(--st-spacing) / 2);
        border-radius: var(--st-border-radius);
        background-color: var(--st-color-background-light);
    }
}
</style>
