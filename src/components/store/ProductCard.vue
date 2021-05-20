<template>
    <div class="product-card" v-if="product">
        <img
            class="product-card__image"
            :src="image"
            @click="goToCollection"
            :alt="product.getName(languageKey)"
        />
        <div class="product-card__footer">
            <div class="product-card__title">
                <h4 class="product-card__title__text">
                    {{ product.getName(languageKey) }}
                </h4>
                <base-button
                    theme="tertiary"
                    icon="buy"
                    :disabled="inCart"
                    v-if="!isOwned"
                    @click="addToCart()"
                    :content="false"
                ></base-button>
                <collection-settings v-else :collection="product.collections[0]"></collection-settings>
            </div>
            <div class="product-card__buttons">
                <base-button
                    theme="secondary"
                    class="product-card__button"
                    icon="arrowRight"
                    @click="goToCollection"
                >
                    {{ $t("common.open") }}
                </base-button>
                <base-button
                    class="product-card__button"
                    icon="info"
                    theme="tertiary"
                    @click="goToItem"
                >
                    {{ $t("store.readmore") }}
                </base-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { Product } from "@/classes/product";
import { useStore } from "@/store";

import CollectionSettings from "../CollectionSettings.vue";
import { Icon } from "@/components/icon";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

@Options({
    components: {
        CollectionSettings,
        Icon,
    },
    name: "product-card",
    props: {
        product: {
            type: Object,
        },
    },
})
export default class ProductCard extends Vue {
    public product?: Product;
    public store = useStore();
    
    public addToCart() {
        if (this.product)
            this.store.commit(
                StripeMutationTypes.CART_ADD_PRODUCT,
                this.product.id,
            );

        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            icon: "buy",
            title: this.$t("store.addedToCart"),
        });
    }

    public get inCart() {
        return this.product
            ? this.store.state.stripe.cart.includes(this.product.id)
            : false;
    }


    public goToCollection() {
        const collectionKey = this.collection?.key;

        if (collectionKey) {
            this.$router.push({
                name: "song-list",
                params: {
                    collection: collectionKey,
                },
            });
        } else {
            this.goToItem();
        }
    }

    public goToItem() {
        if (this.product) {
            this.$router.push({
                name: "collection-item",
                params: {
                    id: this.product.id,
                },
            });
        }
    }

    public get isAvailable() {
        return this.collection?.available;
    }

    public get isOwned() {
        return this.store.getters.user?.subscriptions.some(s => s.collectionIds.includes(this.collection?.id as string));
    }

    public get image() {
        return this.collection?.image
            ? `${this.collection?.image}?w=300&q=50`
            : "/img/placeholder.png";
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        return this.store.state.session.collections.find(
            (c) => c.id == this.product?.collectionIds[0],
        );
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.product-card {
    animation: slideInFromBottom 250ms;
    background-color: var(--st-color-background-medium);
    display: flex;
    flex-direction: column;

    &__buttons {
        display: flex;
        gap: calc(var(--st-spacing) / 2);

        @include breakpoint("medium") {
            flex-direction: column;
        }
    }

    &__button {
        flex-shrink: 0;
        flex-grow: 1;
    }

    &__image {
        width: 100%;
        object-fit: cover;
        transition: transform 150ms;
        cursor: pointer;

        // &:hover {
        //     transform: scale(1.02);
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

    &__title {
        &__text {
            margin: 0;
        }

        width: 100%;
        margin: 0 0 var(--st-spacing) 0;
        display: flex;
        justify-content: space-between;
    }
}
</style>
