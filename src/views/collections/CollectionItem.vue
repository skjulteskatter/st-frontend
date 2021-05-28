<template>
    <div class="">
        <back-button />
        <div class="flex flex-col gap-4 md:flex-row" v-if="product">
            <img
                class="rounded-md shadow-md object-cover"
                :src="image"
                :alt="product.getName(languageKey)"
            />
            <base-card>
                <h1 class="text-xl md:text-2xl font-bold">
                    {{ product.getName(languageKey) }}
                </h1>
                <p class="text-gray-500 text-sm mb-4">
                    {{
                        formatPrices(product.prices, "year") ||
                        formatPrices(product.prices, "month")
                    }}
                </p>
                <div class="mb-8">
                    <base-button
                        theme="secondary"
                        icon="buy"
                        :disabled="inCart"
                        v-if="!ownedIds.includes(product.id)"
                        @click="addToCart()"
                    >
                        {{ $t("store.addToCart") }}
                    </base-button>
                    <base-button theme="tertiary" v-else icon="shop" disabled>
                        {{ $t("store.alreadyOwned") }}
                    </base-button>
                </div>
                <h3 class="font-bold text-lg" v-if="details">{{ $t('store.about') }}</h3>
                <div v-html="details" class="flex flex-col gap-2"></div>
            </base-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton, BaseCard } from "@/components";
import { useStore } from "@/store";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { appSession } from "@/services/session";
import { notify } from "@/services/notify";

@Options({
    components: {
        BackButton,
        BaseCard,
    },
    name: "collection-item",
})
export default class StoreItem extends Vue {
    private store = useStore();
    public loading = false;

    // public async checkout(product: Product) {
    //     this.loading = true;
    //     await this.store?.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
    //         type: "primary",
    //         icon: "shop",
    //         title: this.$t("notification.redirecting"),
    //     });
    //     await this.store.dispatch(StripeActionTypes.START_SESSION);
    //     this.loading = false;
    // }

    public addToCart() {
        if (this.product)
            this.store.commit(
                StripeMutationTypes.CART_ADD_PRODUCT,
                this.product.id,
            );

        notify("success", "shop",this.$t("store.addedToCart"));
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
