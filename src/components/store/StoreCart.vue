<template>
    <BaseDropdown v-if="cartItems.length" origin="right" class="text-sm" :show="true">
        <template #button>
            <ShoppingCartIcon class="w-6 h-6 relative opacity-50" />
            <span class="w-4 h-4 bg-primary rounded-full text-xs text-white flex justify-center items-center absolute -top-1 -right-1">
				{{ cartItems.length }}
			</span>
        </template>
        <div class="w-max" @mouseenter="mouseOn = true" @mouseleave="mouseOn = false">
            <div class="flex gap-4 justify-between items-center mb-4">
                <h3 class="font-bold text-base">{{ $t("store_inCart") }}</h3>
                <SwitchGroup as="div" class="flex items-center gap-2 cursor-pointer">
                    <SwitchLabel class="text-xs text-gray-500 dark:text-gray-400">{{ $t("store_buyYearly") }}</SwitchLabel>
                    <Switch
                        @click="toggleType()"
                        v-model="yearlySub"
                        class="focus-visible:outline-none"
                    >
                        <div
                            class="relative inline-flex items-center h-5 w-8 rounded-full transition-colors my-1"
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
                    <img :src="i.collections.find(c => i.collectionIds.includes(c.id))?.image" class="max-h-12 rounded mr-4 inline-block" height="48" />
                    <div class="inline-block mr-4">
                        <span>{{ i.getName() }}</span>
                        <suspense>
                            <template #fallback>{{ $t("common_loading") }}</template>
                            <template #default>
                                <Price class="opacity-50 text-xs" :product="i" :country="country" />
                            </template>
                        </suspense>
                    </div>
                    <button class="ml-auto cursor-pointer opacity-50" @click="removeProduct(i.id)">
                        <XIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
            <p v-else class="p-2 text-center mb-4 text-gray-400">
                {{ $t('store_noItems') }}
            </p>
            <p class="py-4 text-primary tracking-wider flex justify-between dark:text-white">
                <span>{{ $t("store_total") }}:</span>
                <span>{{ totalPrice }}</span>
            </p>
            <BaseButton theme="secondary" :disabled="!cartItems.length" @click="checkout" :loading="checkingOut" class="w-full">
                <template #icon>
                    <ArrowRightIcon class="w-4 h-4" />
                </template>
                {{ $t("store_checkout") }}
            </BaseButton>
        </div>
    </BaseDropdown>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import http from "@/services/http";
import Price from "./Price.vue";
import { SwitchGroup, Switch, SwitchLabel } from "@headlessui/vue";
import { ShoppingCartIcon } from "@heroicons/vue/outline";
import { XIcon, ArrowRightIcon } from "@heroicons/vue/solid";
import { Product } from "@/classes";
import { storeService } from "@/services/modules";
import { IPrice } from "songtreasures-api";

export default defineComponent({
    name: "store-cart",
    components: {
        Price,
        SwitchGroup,
        Switch,
        SwitchLabel,
        ShoppingCartIcon,
        XIcon,
        ArrowRightIcon,
    },
    data: () => ({
        checkingOut: false,
        country: "",
        mouseOn: false,
        yearlySub: true,
        cartItems: [] as Product[],
        storeService,
    }),
    computed: {
        totalPrice() {
            let total = 0;
            const prices = this.cartItems.map(i => {
                const price = i.prices?.find(p => p.type === this.storeService.type);

                if(price) {
                    return parseInt(price.value.replace(/(\D+)/g, ""));
                }
            });

            for(const price of prices) {
                if(price) {
                    total += price;
                }
            }

            return this.formatPriceFromNumber(total, this.storeService.type);
        },
    },
    async mounted() {
        this.cartItems = await storeService.getCartItems();
        this.country = await http.getCountry();
        storeService.registerHook("productsUpdated", async () => {
            this.cartItems = await storeService.getCartItems();
        });
        storeService.registerHook("checkout", () => {
            this.checkingOut = true;
        });
    },
    methods: {
        formatPrices(prices: IPrice[], type: string) {
            const unformattedPrice = prices.find((price) => price.type == type)
                ?.value;
            const formattedPrice = unformattedPrice?.slice(
                0,
                unformattedPrice.length - 2,
            );
            return `${formattedPrice} /${type}`;
        },
        formatPriceFromNumber(num: number, type: string) {
            return `NOK ${num / 100} / ${this.$t(type).toLocaleLowerCase()}`;
        },
        toggleType() {
            this.storeService.type = this.storeService.type === "year" ? "month" : "year";
        },
        async checkout() {
            this.checkingOut = true;
            await this.storeService.checkout();
            this.checkingOut = false;
        },
        clearCart() {
            this.storeService.cart = [];
        },
        removeProduct(id: string) {
            this.storeService.removeProduct(id);
        },
    },
});
</script>
