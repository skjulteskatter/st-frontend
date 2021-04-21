<template>
    <div class="product-card" v-if="product">
        <img
            :class="`product-card__image ${isAvailable ? 'clickable' : ''}`"
            :src="image"
            @click="goToCollection"
            :alt="product.getName(languageKey)"
        />
        <div class="product-card__footer">
            <h4 class="product-card__title">
                {{ product.getName(languageKey) }}
            </h4>
            <div class="product-card__buttons">
                <base-button
                    theme="secondary"
                    class="product-card__button"
                    icon="arrowRight"
                    v-if="isAvailable"
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

import { BaseButton } from "@/components";
import { Product } from "@/classes/product";
import { useStore } from "@/store";

@Options({
    name: "product-card",
    props: {
        product: {
            type: Object,
        },
    },
    components: {
        BaseButton,
    },
})
export default class ProductCard extends Vue {
    public product?: Product;
    public store = useStore();

    public goToCollection() {
        const collectionKey = this.collection?.key ?? "";

        if (this.collection?.available == true) {
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

    public get image() {
        return this.collection?.image
            ? `${this.collection?.image}?w=300&q=50`
            : "/img/placeholder.png";
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        return this.store.getters.collections.find(
            (c) => c.id == this.product?.collectionIds[0]
        );
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.product-card {
    animation: slideInFromBottom 250ms;
    background-color: var(--st-color-background-medium);
    border-radius: var(--st-border-radius);
    overflow: hidden;
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
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0 0 var(--st-spacing) 0;
    }
}
</style>
