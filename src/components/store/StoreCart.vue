<template>
    <base-dropdown origin="right" class="text-sm" icon="buy" :label="`${$t('store.inCart')} (${cartItems.length})`" v-if="cartItems.length">
        <div class="w-max">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-base">{{ $t("store.inCart") }}</h3>
                <button @click="clearCart" class="text-red-700 cursor-pointer">
                    {{ $t("store.clearCart") }}
                </button>
            </div>
            <div class="flex flex-col gap-4 mb-4">
                <div
                    v-for="i in cartItems"
                    :key="i.id"
                    class="p-2 bg-gray-200 rounded flex justify-between gap-4"
                >
                    {{ i.getName(languageKey) }}
                    <small class="text-gray-500">{{ formatPrices(i.prices, "year") }}</small>
                </div>
            </div>
            <base-button @click="checkout" icon="arrowRight" class="w-full">
                {{ $t("store.checkout") }}
            </base-button>
        </div>
    </base-dropdown>
</template>
<script lang="ts">
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { Options, Vue } from "vue-class-component";

@Options({
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

<style lang="scss" >
@import "../../style/mixins";

.store-cart__modal {
    .modal__open-button {
        .button__content {
            @include breakpoint("small") {
                display: none;
            }
        }
    }
}

.store-cart {
    min-width: 30vw;
    min-height: 30vh;
    display: flex;
    flex-direction: column;

    @include breakpoint("small"){
        min-width: 80vw;
    }

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
