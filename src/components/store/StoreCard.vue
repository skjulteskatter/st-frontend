<template>
    <div class="store-card" v-if="product">
        <img
            class="store-card__image"
            :src="image"
            :alt="product.name[languageKey]"
        />
        <h3 class="store-card__title">{{ product.name[languageKey] }}</h3>
        <div class="store-card__footer">
            <p class="store-card__price">
                {{ formatPrices(product.prices, "year") }}
            </p>
            <base-button
                class="store-card__button"
                v-if="isPurchaseable"
                icon="shop"
                :action="action"
            >
                <span>{{ $t("store.buy") }}</span>
            </base-button>
            <span class="store-card__subtitle" v-else>
                {{ $t("store.alreadyown") }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

import { BaseCard, BaseButton } from "@/components";
import { Icon } from "@/components/icon";

@Options({
    components: {
        BaseCard,
        BaseButton,
        Icon,
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
})
export default class StoreCard extends Vue {
    public product?: Product;
    public isPurchaseable = false;
    public action = () => undefined;
    public userStore = useStore(sessionKey);
    private loading = false;

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
            ? `${this.product?.collections[0].image}?w=400`
            : "/img/placeholder.png";
    }

    public get languageKey() {
        return this.userStore.getters.languageKey ?? "en";
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.store-card {
    @include breakpoint("small") {
        .store-card__price {
            display: none;
        }
    }

    &__image {
        max-width: 100%;
        // max-height: 300px;
        border-radius: var(--st-border-radius);
    }

    &__footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__price {
        opacity: 0.5;
        margin: 0;
    }

    &__title {
        margin-top: var(--st-spacing);
        margin-bottom: calc(var(--st-spacing) / 2);
        width: 100%;
        word-wrap: break-word;
    }

    &__subtitle {
        opacity: 0.7;
    }
}
</style>