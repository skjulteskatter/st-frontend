<template>
    <div class="store-item">
        <back-button />
        <section class="store-item__body" v-if="product">
            <img
                class="store-item__image"
                :src="image"
                :alt="product.getName(languageKey)"
            />
            <div class="store-item__body__info">
                <h1 class="store-item__title">
                    {{ product.getName(languageKey) }}
                </h1>
                <span class="store-item__price-tag">
                    {{
                        formatPrices(product.prices, "year") ||
                        formatPrices(product.prices, "month")
                    }}
                </span>
                <div v-html="details" class="store-item__details"></div>
                <div class="store-item__body__footer">
                    <base-button
                        theme="secondary"
                        icon="shop"
                        @click="product ? checkout(product) : undefined"
                    >
                        {{ $t("store.buy") }}
                    </base-button>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { notificationKey, stripeKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore as vStore } from "vuex";
import { BackButton, BaseButton } from "@/components";
import { Product } from "@/classes/product";
import { useStore } from "@/store/typed";

@Options({
    components: {
        BackButton,
        BaseButton,
    },
    name: "store-item",
})
export default class StoreItem extends Vue {
    private stripeStore = vStore(stripeKey);
    private notifications = vStore(notificationKey);
    private store = useStore();
    public loading = false;

    public async checkout(product: Product) {
        this.loading = true;
        await this.notifications?.dispatch("addNotification", {
            type: "primary",
            icon: "shop",
            title: this.$t("notification.redirecting"),
        });
        await this.stripeStore.dispatch("startSession", product.id);
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
        return this.store.state.session.collections.filter((c) =>
            this.product?.collectionIds.includes(c.id),
        );
    }

    public get details() {
        return this.collections[0].getDetails(this.languageKey);
    }

    public get products() {
        return this.stripeStore.state.products;
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

.store-item {
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

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
            margin-left: var(--st-spacing);
            padding: calc(var(--st-spacing) * 2);
            background-color: var(--st-color-background-medium);
            border-radius: 0.5rem;
        }
    }
}
</style>
