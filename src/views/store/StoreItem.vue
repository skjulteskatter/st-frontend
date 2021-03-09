<template>
    <div class="store-item">
        <back-button />
        <section class="store-item__body" v-if="product">
            <img
                class="store-item__image"
                :src="image"
                :alt="product.name[languageKey]"
            />
            <div class="store-item__body__info">
                <h1 class="store-item__title">
                    {{ product.name[languageKey] }}
                </h1>
                <span class="store-item__price-tag">
                    {{ formatPrices(product.prices, "year") }}
                </span>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis ratione, deleniti veritatis ea quam esse qui
                    reiciendis. Magnam numquam dolorem, consequuntur laboriosam
                    veritatis quasi soluta voluptate praesentium sint nihil
                    doloremque.
                </p>
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
import { notificationKey, sessionKey, stripeKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BackButton, BaseButton } from "@/components";

@Options({
    components: {
        BackButton,
        BaseButton,
    },
})
export default class StoreItem extends Vue {
    private store = useStore(stripeKey);
    private notifications = useStore(notificationKey);
    public loading = false;

    public checkout(product: Product) {
        this.loading = true;
        this.notifications?.dispatch("addNotification", {
            type: "primary",
            icon: "shop",
            title: this.$t("notification.redirecting"),
        });
        const price = product.prices.find((p) => p.type == "year");

        if (price) {
            this.store.dispatch("startSession", price.id);
            this.loading = false;
        }
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

    public get products() {
        return this.store.state.products;
    }

    public get product() {
        return this.products.find((p) => p.id == this.$route.params.id);
    }

    public get languageKey() {
        return useStore(sessionKey).getters.languageKey;
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
        border: 5px solid var(--st-color-border);
    }

    &__body {
        display: flex;
        padding: 0;

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