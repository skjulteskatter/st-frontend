<template>
    <base-dropdown v-if="cartItems.length" origin="right" class="text-sm" :show="show">
        <template #button>
            <ShoppingCartIcon class="w-6 h-6 relative opacity-50" />
            <span v-if="cartItems.length" class="w-4 h-4 bg-primary rounded-full text-xs text-white flex justify-center items-center absolute -top-1 -right-1">
				{{ cartItems.length }}
			</span>
        </template>
        <div class="w-max" @mouseenter="mouseOn = true" @mouseleave="mouseOn = false">
            <div class="flex gap-4 justify-between items-center mb-4">
                <h3 class="font-bold text-base">{{ $t("store.inCart") }}</h3>
                <SwitchGroup as="div" class="flex items-center gap-2 cursor-pointer">
                    <SwitchLabel class="text-xs text-gray-500 dark:text-gray-400">{{ $t("store.buyYearly") }}</SwitchLabel>
                    <Switch
                        @click="toggleType()"
                        v-model="yearlySub"
                        class="focus:outline-none"
                    >
                        <div
                            class="relative inline-flex items-center h-4 w-8 rounded-full transition-colors my-1"
                            :class="yearlySub ? 'bg-primary' : 'bg-gray-300 dark:bg-black dark:bg-opacity-40'"
                        >
                            <span
                                :class="yearlySub ? 'translate-x-4' : 'translate-x-1'"
                                class="shadow-md inline-block w-3 h-3 transform bg-white rounded-full transition-transform dark:bg-secondary"
                            />
                        </div>
                    </Switch>
                </SwitchGroup>
            </div>
            <div class="flex flex-col" v-if="cartItems.length">
                <div
                    v-for="i in cartItems"
                    :key="i.id"
                    class="py-4 flex items-center border-b border-gray-200 dark:border-gray-500"
                >
                    <img :src="i.collections.find(c => i.collectionIds.includes(c.id))?.image" class="max-h-12 rounded mr-4 inline-block" />
                    <div class="inline-block mr-4">
                        <span>{{ i.getName(languageKey) }}</span>
                        <price-div class="opacity-50 text-xs" :product="i" :country="country" />
                    </div>
                    <button class="ml-auto cursor-pointer opacity-50" @click="removeProduct(i.id)">
                        <XIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
            <p v-else class="p-2 text-center mb-4 text-gray-400">
                {{ $t('store.noItems') }}
            </p>
            <p class="py-4 text-primary tracking-wider flex justify-between dark:text-white">
                <span>{{ $t("store.total") }}:</span>
                <span>{{ totalPrice }}</span>
            </p>
            <base-button theme="secondary" :disabled="checkingOut || !cartItems.length" @click="checkout" :loading="checkingOut" class="w-full">
                <template #icon>
                    <ArrowRightIcon class="w-4 h-4" />
                </template>
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
import { SwitchGroup, Switch, SwitchLabel } from "@headlessui/vue";
import { ShoppingCartIcon } from "@heroicons/vue/outline";
import { XIcon, ArrowRightIcon } from "@heroicons/vue/solid";

@Options({
    name: "store-cart",
    components: {
        PriceDiv,
        SwitchGroup,
        Switch,
        SwitchLabel,
        ShoppingCartIcon,
        XIcon,
        ArrowRightIcon,
    },
})
export default class StoreCart extends Vue {
    private store = useStore();
    public checkingOut = false;
    public country = "";
    public mouseOn = false;

    public yearlySub = true;

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
    
    public formatPriceFromNumber(num: number, type: string) {
        return `NOK ${num / 100} / ${this.$t(type).toLocaleLowerCase()}`;
    }

    public toggleType() {
        this.type = this.type == "year" ? "month" : "year";
    }

    public get totalPrice() {
        let total = 0;
        const prices = this.cartItems.map(i => {
            const price = i.prices?.find(p => p.type == this.type);

            if(price) {
                return parseInt(price.value.replace(/(\D+)/g, ""));
            }
        });

        for(const price of prices) {
            if(price) {
                total += price;
            }
        }

        return this.formatPriceFromNumber(total, this.type);
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

    public removeProduct(id: string) {
        this.store.commit(StripeMutationTypes.CART_REMOVE_PRODUCT, id);
    }
}
</script>
