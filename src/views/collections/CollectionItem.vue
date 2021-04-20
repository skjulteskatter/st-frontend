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
                        v-if="collections.length == 1"
                        @click="product ? checkout(product) : undefined"
                    >
                        {{ $t("store.buy") }}
                    </base-button>
                    <base-button
                        theme="primary"
                        icon="shop"
                        @click="checkoutAll()"
                    >
                        {{ $t("store.buyall")}}
                    </base-button>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton, BaseButton } from "@/components";
import { Product } from "@/classes/product";
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

@Options({
    components: {
        BackButton,
        BaseButton,
    },
    name: "collection-item",
})
export default class StoreItem extends Vue {
    private store = useStore();
    public loading = false;

    public async checkout(product: Product) {
        this.loading = true;
        await this.store?.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "primary",
            icon: "shop",
            title: this.$t("notification.redirecting"),
        });
        await this.store.dispatch(StripeActionTypes.START_SESSION, product.id);
        this.loading = false;
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
        return this.store.getters.collections.filter((c) =>
            this.product?.collectionIds.includes(c.id),
        );
    }

    public checkoutAll() {
        const all = this.products.find(p => p.collections.length > 1);

        if (all) {
            if (all.id == this.product?.id) {
                this.checkout(all);
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
