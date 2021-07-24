<template>
    <div class="flex flex-col rounded-lg overflow-hidden shadow-md relative" :class="{'border border-green-700': product.owned}" v-if="product && collection">
        <icon name="lock" v-if="!collection.available" class="absolute top-4 left-4 text-secondary z-10" />
        <div class="overflow-hidden">
            <img
                class="w-full object-cover cursor-pointer transition transform hover:scale-105"
                :src="image"
                @click="goToCollection"
                :alt="product.getName(languageKey)"
            />
        </div>
        <div class="w-full p-4 bg-white flex flex-col flex-grow justify-between border-t border-gray-300 dark:bg-secondary dark:border-none">
            <div class="flex justify-between items-start mb-4">
                <h4 class="font-bold">
                    {{ product.getName(languageKey) }}
                </h4>
                <price class="text-gray-400 flex-shrink-0" v-if="!product.owned" :product="product" :country="languageKey" />
            </div>
            <div class="flex flex-col gap-2 lg:flex-row">
                <base-button
                    class="flex-grow"
                    theme="secondary"
                    icon="buy"
                    :disabled="inCart || !collection.enabled"
                    v-if="!product.owned"
                    @click="addToCart()"
                >{{ $t('store.addToCart') }}</base-button>
                <base-button
                    class="flex-grow"
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

import Price from "./Price.vue";

import { appSession } from "@/services/session";
// import { notify } from "@/services/notify";

@Options({
    components: {
        Price,
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
        this.collection?.addToCart();
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

    public get image() {
        return this.collection?.image
            ? `${this.collection?.image}?w=300&q=50`
            : "/img/placeholder.png";
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        return appSession.collections.find(
            (c) => c.id == this.product?.collectionIds[0],
        );
    }
}
</script>
