<template>
    <base-dropdown v-if="cartItems.length" origin="right" class="text-sm" icon="buy" :show="show">
        <template #button>
            <icon name="buy" class="relative" />
            <span v-if="cartItems.length" class="w-4 h-4 bg-primary rounded-full text-xs text-white flex justify-center items-center absolute -top-1 -right-1">
				{{ cartItems.length }}
			</span>
        </template>
        <div class="w-max" @mouseenter="mouseOn = true" @mouseleave="mouseOn = false">
            <div class="flex gap-4 justify-between items-center mb-4">
                <h3 class="font-bold text-base">{{ $t("store.inCart") }}</h3>
                <button @click="clearCart" class="text-red-700 cursor-pointer hover:underline" v-if="cartItems.length">
                    {{ $t("store.clearCart") }}
                </button>
            </div>
            <div class="flex flex-col gap-2 mb-4" v-if="cartItems.length">
                <div
                    v-for="i in cartItems"
                    :key="i.id"
                    class="p-2 bg-black bg-opacity-10 rounded flex justify-between gap-4"
                >
                    {{ i.getName(languageKey) }}
                    <small class="text-gray-500"><price-div :product="i" :country="country"></price-div></small>
                </div>
            </div>
            <p v-else class="p-2 text-center mb-4 text-gray-400">
                {{ $t('store.noItems') }}
            </p>
            
            <base-button :icon="type == 'year' ? 'check' : 'error'" :theme="type == 'year' ? 'success' : 'primary'" class="text-md" @click="type == 'year' ? type = 'month' : type = 'year'">{{$t('store.buyYearly')}}</base-button>
            
            <!-- <select
                v-model="type"
            >
                <option
                    key="year"
                    value="year"
                >{{$t('year')}}</option>
                <option
                    key="month"
                    value="month"
                >{{$t('month')}}</option>
            </select> -->
            <base-button :disabled="checkingOut || !cartItems.length" @click="checkout" icon="arrowRight" :loading="checkingOut" class="w-full">
                {{ $t("store.checkout") }}
            </base-button>
        </div>
    </base-dropdown>
</template>
<script lang="ts">
import http from "@/services/http";
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { Options, Vue } from "vue-class-component";
import PriceDiv from "./Price.vue";

@Options({
    name: "store-cart",
    components: {
        PriceDiv,
    },
})
export default class StoreCart extends Vue {
    private store = useStore();
    public checkingOut = false;
    public country = "";
    public mouseOn = false;

    public async mounted() {
        this.country = await http.getCountry();
    }

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

    public get type() {
        return this.store.state.stripe.type;
    }

    public set type(v) {
        this.store.commit(StripeMutationTypes.CART_TYPE, v);
    }

    public async checkout() {
        this.checkingOut = true;
        await this.store.dispatch(StripeActionTypes.START_SESSION);
        this.checkingOut = false;
    }

    public get show() {
        return this.store.state.stripe.showCart == true || this.mouseOn;
    }

    public clearCart() {
        this.store.commit(StripeMutationTypes.CART_CLEAR);
    }
}
</script>
