<template>
    <div class="store-card" v-if="product">
        <img
            class="store-card__image clickable"
            :src="image"
            @click="goToCollection"
            :alt="product.getName(languageKey)"
        />
        <div class="store-card__footer">
            <h4 class="store-card__title">
                {{ product.getName(languageKey) }}
            </h4>
            <div class="store-card__buttons">
                <base-button
                    theme="secondary"
                    class="store-card__button"
                    icon="arrowRight"
                    @click="goToCollection"
                >
                    {{ $t("common.open") }}
                </base-button>
                <base-button
                    class="store-card__button"
                    icon="info"
                    theme="tertiary"
                    @click="goToItem"
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
import { useStore } from "@/store";

@Options({
    components: {
        BaseButton,
    },
    props: {
        product: {
            type: Object,
        },
    },
    name: "product-card",
})
export default class StoreCard extends Vue {
    public product?: Product;
    public store = useStore();

    public goToCollection() {
        const collectionKey = this.collection?.key ?? "";

        this.$router.push({
            name: "song-list",
            params: {
                collection: collectionKey,
            },
        });
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

    &__price {
        opacity: 0.5;
        margin: 0;
    }

    &__title {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0 0 var(--st-spacing) 0;
    }

    &__subtitle {
        opacity: 0.7;
    }
}
</style>
