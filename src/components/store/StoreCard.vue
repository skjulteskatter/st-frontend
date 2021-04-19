<template>
    <div class="store-card" v-if="product">
        <img
            class="store-card__image"
            :src="image"
            :alt="product.getName(languageKey)"
        />
        <div class="store-card__footer">
            <h4 class="store-card__title">
                {{ product.getName(languageKey) }}
            </h4>
            <div class="store-card__buttons">
                <router-link :to="collectionLink">
                    <base-button
                        theme="secondary"
                        class="store-card__button"
                        icon="arrowRight"
                        disabled
                    >
                        {{ $t("common.open") }}
                    </base-button>
                </router-link>
                <base-button
                    class="store-card__button"
                    icon="info"
                    theme="tertiary"
                    @click="action"
                >
                    {{ $t("store.seemore") }}
                </base-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { BaseButton } from "@/components";
import { Product } from "@/classes/product";
import { useStore } from "@/store/typed";

@Options({
    components: {
        BaseButton,
    },
    props: {
        product: {
            type: Object,
        },
        isPurchaseable: {
            type: Boolean,
        },
        action: {
            type: Function,
        },
    },
    name: "store-card",
})
export default class StoreCard extends Vue {
    public product?: Product;
    public isPurchaseable = false;
    public action = () => undefined;
    public store = useStore();

    public get collectionLink() {
        const collectionKey = this.product?.collections[0].key ?? "";

        return {
            name: "song-list",
            params: {
                collection: collectionKey,
            },
        };
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
        return this.product?.collections[0].image
            ? `${this.product?.collections[0].image}?w=300&q=50`
            : "/img/placeholder.png";
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.store-card {
    animation: slideInFromBottom 250ms;
    background-color: var(--st-color-background-medium);
    border-radius: var(--st-border-radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    @include breakpoint("small") {
        .store-card__price {
            display: none;
        }
    }

    &__buttons {
        display: flex;
        gap: calc(var(--st-spacing) / 2);

        @include breakpoint("medium") {
            flex-direction: column;
        }
    }

    &__button {
        flex-shrink: 0;
    }

    &__image {
        width: 100%;
        object-fit: cover;
        transition: transform 150ms;
        // cursor: pointer;

        // &:hover {
        //     transform: scale(1.05);
        // }
    }

    &__footer {
        width: 100%;
        padding: var(--st-spacing);
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        background: var(--st-color-background-light);
        flex-grow: 1;
    }

    &__price {
        opacity: 0.5;
        margin: 0;
    }

    &__title {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-top: 0;
    }

    &__subtitle {
        opacity: 0.7;
    }
}
</style>
