<template>
    <div class="collection-item">
        <back-button />
        <section class="collection-item__body" v-if="product">
            <img
                class="collection-item__image"
                :src="image"
                :alt="product.getName(languageKey)"
            />
            <div class="collection-item__body__info">
                <h1 class="collection-item__title">
                    {{ product.getName(languageKey) }}
                </h1>
                <span class="collection-item__price-tag">
                    {{
                        formatPrices(product.prices, "year") ||
                        formatPrices(product.prices, "month")
                    }}
                </span>
                <div v-html="details" class="collection-item__details"></div>
                <div class="collection-item__body__footer">
                    <base-button
                        theme="secondary"
                        icon="shop"
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
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton } from "@/components";
import { useStore } from "@/store";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

@Options({
    components: {
        BackButton,
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

        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            icon: "shop",
            title: this.$t("store.addedToCart"),
        });
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
        return this.store.state.session.collections.filter((c) =>
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

<style lang="scss" scoped>
@import "../../style/mixins";

.collection-item {
    &__price-tag {
        color: var(--st-color-primary);
    }

    &__title {
        margin-top: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &__image {
        border-radius: 0.5rem;
    }

    &__body {
        display: flex;
        padding: 0;
        animation: slideInFromBottom 250ms;

        @include breakpoint("small") {
            flex-direction: column;

            .store-item__body__info {
                margin: var(--st-spacing) 0 0 0;
            }

            .store-item__body__footer {
                flex-direction: column;
            }
        }

        &__footer {
            display: flex;
            gap: var(--st-spacing);
        }

        &__info {
            padding: calc(var(--st-spacing) * 2);
            background-color: var(--st-color-background-medium);
            border-radius: 0.5rem;
        }
    }
}
</style>
