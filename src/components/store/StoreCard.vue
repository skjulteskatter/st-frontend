<template>
    <div class="store-card" v-if="product">
        <img
            class="store-card__image clickable"
            :src="image"
            :alt="product.name[languageKey]"
            @click="gotoCollection(product)"
        />
        <div class="store-card__footer">
            <h3 class="store-card__title">{{ product.name[languageKey] }}</h3>
            <!-- <p class="store-card__price">
                {{ formatPrices(product.prices, "year") }}
            </p> -->
            <base-button
                class="store-card__button"
                icon="info"
                theme="primary"
                @click="action"
            >
                <span>{{ $t("store.seemore") }}</span>
            </base-button>
            <!-- <span class="store-card__subtitle" v-else>
                {{ $t("store.alreadyown") }}
            </span> -->
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

    public gotoCollection(product: Product) {
        const collectionKey = product?.collections[0].key ?? "";

        this.$router.push({
            name: "song-list",
            params: {
                collection: collectionKey,
            },
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

    &__button {
        flex-shrink: 0;
    }

    &__image {
        max-width: 100%;
        border-radius: 0.5rem;
        border: 3px solid var(--st-color-border);
        object-fit: cover;
    }

    &__footer {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }

    &__price {
        opacity: 0.5;
        margin: 0;
    }

    &__title {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &__subtitle {
        opacity: 0.7;
    }
}
</style>