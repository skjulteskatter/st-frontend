<template>
    <Loader :loading="checkingOut" position="global">
        <BaseModal :show="products.length > 0 && !cancel" @close="cancel = true">
            <template #title>
                <div class="flex gap-4 justify-between w-full">
                    <h3 class="text-lg font-bold">{{$t('store_addedToCart')}}</h3>
                    <SwitchGroup as="div" class="flex items-center gap-2 cursor-pointer">
                        <SwitchLabel class="text-sm text-gray-500 dark:text-gray-400">{{ $t("store_buyYearly") }}</SwitchLabel>
                        <Switch
                            @click="storeService.toggleType()"
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
            </template>
            <div class="flex flex-col gap-2 mb-4">
                <div
                    v-for="p in products"
                    :key="p.id"
                    class="flex items-center p-2 rounded-md bg-black/5 dark:bg-white/5"
                >
                    <img
                        :src="p.collections[0].image"
                        alt="collection image"
                        class="rounded h-12 w-12 mr-4 border"
                        width="48"
                        height="48"
                    >
                    <span>
                        <h4 class="text-base">{{ p.getName() }}</h4>
                        <suspense>
                            <template #fallback>{{ $t("common_loading") }}</template>
                            <template #default>
                                <Price class="opacity-50" :product="p"/>
                            </template>
                        </suspense>
                    </span>
                </div>
            </div>
            <button @click="addAllItemsCheckout" class="opacity-50 p-4 w-full flex justify-center gap-2 items-center text-sm rounded-md hover:opacity-100 border border-transparent hover:border-black/20">
                <ShoppingCartIcon class="w-4 h-4 opacity-50" />
                <span>{{$t('store_allItems')}}</span>
            </button>
            <template #footer>
                <div class="flex gap-2 justify-end">
                    <BaseButton theme="tertiary" @click="cancel = true">{{$t('store_continue')}}</BaseButton>
                    <BaseButton theme="secondary" @click="checkout" :disabled="checkingOut" :loading="checkingOut">{{$t('store_checkout')}}</BaseButton>
                </div>
            </template>
        </BaseModal>
    </Loader>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BaseModal } from "..";
import Price from "./Price.vue";
import { SwitchGroup, Switch, SwitchLabel } from "@headlessui/vue";
import { ShoppingCartIcon } from "@heroicons/vue/solid";
import { storeService } from "@/services/modules";
import { appSession } from "@/services/session";
import { Product } from "@/classes";

export default defineComponent({
    name: "added-to-cart",
    components: {
        BaseModal,
        Price,
        SwitchGroup,
        Switch,
        SwitchLabel,
        ShoppingCartIcon,
    },
    data: () => ({
        cancel: false,
        checkingOut: false,
        yearlySub: true,
        storeService,
        products: [] as Product[],
    }),
    methods: {
        async checkout() {
            this.checkingOut = true;
            await this.storeService.checkout();
            this.checkingOut = false;
        },
        async addAllItemsCheckout() {
            const products = await storeService.getProducts();
            this.storeService.cart = products.filter(i => i.collections[0]?.enabled && !appSession.user?.subscriptions.some(s => s.productIds.includes(i.id))).map(i => i.id);
            await this.checkout();
        },
    },
    async mounted() {
        this.storeService.registerHook("productsUpdated", async () => {
            this.cancel = false;
            this.products = await storeService.getCartItems() as Product[];
        });
        this.storeService.registerHook("checkout", () => {
            this.checkingOut = true;
        });
    },
});
</script>
