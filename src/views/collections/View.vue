<template>
    <div>
        <back-button class="mb-4" />
        <div class="grid gap-4 lg:grid-cols-3" v-if="product">
            <div>
                <img
                    class="rounded-md shadow-lg w-full"
                    :src="image"
                    :alt="product.getName(languageKey)"
                />
            </div>
            <base-card class="p-4 lg:col-span-2">
                <h1 class="text-xl md:text-2xl font-bold">
                    {{ product.getName(languageKey) }}
                </h1>
                <p class="text-gray-500 text-sm mb-4 dark:text-gray-400">
                    <price-div :product="product" :country="country"></price-div>
                </p>
                <div class="mb-4">
                    <base-button
                        theme="secondary"
                        :disabled="inCart || !collections[0].enabled"
                        v-if="!product.owned"
                        @click="addToCart()"
                    >
                        <template #icon>
                            <ShoppingCartIcon class="w-4 h-4" />
                        </template>
                        {{ $t("store_addToCart") }}
                    </base-button>
                    <span class="opacity-50" v-else>
                        {{ $t("store_alreadyOwned") }}
                    </span>
                </div>
                <h3 class="font-bold text-lg mt-8" v-if="details">{{ $t('store_about') }}</h3>
                <div v-html="details" class="flex flex-col gap-2 text-sm"></div>
            </base-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton } from "@/components";
import { useStore } from "@/store";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { appSession } from "@/services/session";
import http from "@/services/http";
import {Price as PriceDiv} from "@/components/store";
import { ShoppingCartIcon } from "@heroicons/vue/solid";

@Options({
    components: {
        BackButton,
        PriceDiv,
        ShoppingCartIcon,
    },
    name: "collection-item",
})
export default class StoreItem extends Vue {
    private store = useStore();
    public loading = false;
    public country = "";

    public async mounted() {
        this.country = await http.getCountry();
    }

    public addToCart() {
        if (this.product)
            this.store.commit(
                StripeMutationTypes.CART_ADD_PRODUCT,
                this.product.id,
            );
    }

    public get discounted() {
        return this.product?.discounted(this.country) === true;
    }

    public get price() {
        return this.product?.price?.value;
    }

    public get currency() {
        return this.price?.split(" ")[0];
    }

    public get amount(): number | null {
        const n = this.product?.price?.value.split(" ")[1];
        return n ? parseInt(n) / 100 : null;
    }

    public get type() {
        return "year";
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

    public get image() {
        return this.product?.collections[0].image + "?w=400";
    }

    public get collections() {
        return appSession.collections.filter((c) =>
            this.product?.collectionIds.includes(c.id),
        );
    }

    public get inCart() {
        return this.product
            ? this.store.state.stripe.cart.includes(this.product.id)
            : false;
    }

    public checkoutAll() {
        const all = this.products.find((p) => p.collections.length > 1);

        if (all) {
            if (all.id == this.product?.id) {
                this.addToCart();
            } else {
                this.$router.push({
                    name: "collection-item",
                    params: {
                        id: all.id,
                    },
                });
            }
        }
    }

    public get details() {
        return this.collections[0].getDetails(this.languageKey);
    }

    public get products() {
        return this.store.getters.products;
    }

    public get product() {
        return this.products.find((p) => p.id == this.$route.params.id);
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get ownedIds() {
        return (
            this.store.getters.user?.subscriptions
                .map((s) => s.productIds)
                .reduce((a, b) => [...a, ...b], [] as string[]) ?? []
        );
    }
}
</script>