<template>
    <base-dropdown origin="right" class="text-sm" icon="buy">
        <template #button>
            <icon name="buy" class="relative" />
            <span v-if="cartItems.length" class="w-4 h-4 bg-primary rounded-full text-xs text-white flex justify-center items-center absolute -top-1 -right-1">
				{{ cartItems.length }}
			</span>
        </template>
        <div class="w-max">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-base">{{ $t("store.inCart") }}</h3>
                <button @click="clearCart" class="text-red-700 cursor-pointer">
                    {{ $t("store.clearCart") }}
                </button>
            </div>
            <div class="flex flex-col gap-2 mb-4">
                <div
                    v-for="i in cartItems"
                    :key="i.id"
                    class="p-2 bg-gray-200 rounded flex justify-between gap-4"
                >
                    {{ i.getName(languageKey) }}
                    <small class="text-gray-500">{{ formatPrices(i.prices, "year") }}</small>
                </div>
            </div>
            <base-button :disabled="checkingOut" @click="checkout" icon="arrowRight" :loading="checkingOut" class="w-full">
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
    public checkingOut = false;

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
        this.checkingOut = true;
        await this.store.dispatch(StripeActionTypes.START_SESSION);
        this.checkingOut = false;
    }

    public clearCart() {
        this.store.commit(StripeMutationTypes.CART_CLEAR);
    }
}
</script>
