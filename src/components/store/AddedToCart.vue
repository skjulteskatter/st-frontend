<template>
    <loader :loading="checkingOut" position="global">
        <base-modal :show="Show" @close="cancel = true">
            <div class="flex flex-col gap-4">
                <div class="flex justify-between gap-4">
                    <h3 class="text-lg font-bold">{{$t('store.addedToCart')}}</h3>
                    <SwitchGroup as="div" class="flex items-center gap-2 cursor-pointer">
                        <SwitchLabel class="text-sm text-gray-500 dark:text-gray-400">{{ $t("store.buyYearly") }}</SwitchLabel>
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
                
                <div class="flex flex-col gap-2 divide-y divide-gray-200">
                    <div
                        v-for="p in Products"
                        :key="p.id"
                        class="py-4 flex items-center"
                    >
                        <img
                            :src="p.collections[0].image"
                            alt="collection image"
                            class="rounded h-12 w-12 mr-4"
                        >
                        <span>
                            <p class="text-base">{{ p.getName() }}</p>
                            <price-div class="opacity-50 text-sm" :product="p"/>
                        </span>
                    </div>
                </div>
                <div class="flex gap-4 justify-end">
                    <base-button theme="tertiary" @click="cancel = true">{{$t('store.continue')}}</base-button>
                    <base-button theme="primary" @click="addAllItemsCheckout">{{$t('store.allItems')}}</base-button>
                    <base-button theme="secondary" @click="checkout" :loading="checkingOut">
                        <template #icon>
                            <ShoppingCartIcon class="w-4 h-4" />
                        </template>
                        {{$t('store.checkout')}}
                    </base-button>
                </div>
            </div>
        </base-modal>
    </loader>
</template>
<script lang="ts">
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { Options, Vue } from "vue-class-component";
import { BaseModal } from "..";
import PriceDiv from "./Price.vue";
import { SwitchGroup, Switch, SwitchLabel } from "@headlessui/vue";
import { ShoppingCartIcon } from "@heroicons/vue/solid";

@Options({
    name: "added-to-cart",
    components: {
        BaseModal,
        PriceDiv,
        SwitchGroup,
        Switch,
        SwitchLabel,
        ShoppingCartIcon,
    },
})
export default class AddedToCart extends Vue {
    private store = useStore();
    public cancel = false;
    public checkingOut = false;

    public yearlySub = true;

    public toggleType() {
        this.type = (this.type == "year" ? "month" : "year");
    }

    public get type() {
        return this.store.state.stripe.type;
    }

    public set type(v) {
        this.store.commit(StripeMutationTypes.CART_TYPE, v);
    }

    public get Show() {
        return this.checkingOut || (this.store.state.stripe.cart.length == 1 && !this.cancel && this.store.getters.user?.termsAndConditions == true);
    }
    
    public async checkout() {
        this.checkingOut = true;
        await this.store.dispatch(StripeActionTypes.START_SESSION);
        this.checkingOut = false;
    }

    public async addAllItemsCheckout() {
        this.store.commit(StripeMutationTypes.CART_SET, this.store.getters.products.filter(i => i.collections[0]?.enabled && !this.store.getters.user?.subscriptions.some(s => s.productIds.includes(i.id))).map(i => i.id));

        await this.checkout();
    }

    public get Products() {
        return this.store.getters.cartItems;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
