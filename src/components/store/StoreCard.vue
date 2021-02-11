<template>
    <base-card
        v-if="product"
        class="store-card"
        :image="product.collections[0].image || placeholderImage"
        border
    >
        <h2 class="store-card__itle">
            {{ product.name[languageKey] }}
        </h2>
        <div class="store-card__footer">
            <p class="store-card__price">
                {{ formatPrices(product.prices, "year") }}
            </p>
            <base-button
                class="store-card__button"
                v-if="isPurchaseable"
                :action="action"
            >
                {{ $t("store.buy") }}
            </base-button>
            <span class="store-card__subtitle" v-else>
                {{ $t("store.alreadyown") }}
            </span>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";

@Options({
    components: {
        BaseCard,
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

    public get placeholderImage() {
        return "placeholder.png";
    }

    public get languageKey() {
        return this.userStore.getters.languageKey ?? "en";
    }
}
</script>

<style lang="scss">
.store-card {
    .card__content {
        display: flex;
        flex-direction: column;
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
        margin-top: 0;
    }

    &__subtitle {
        opacity: 0.7;
    }
}
</style>