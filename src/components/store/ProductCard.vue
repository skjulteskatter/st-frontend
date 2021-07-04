<template>
    <div class="flex flex-col rounded-lg overflow-hidden shadow-md relative" :class="{'border border-green-700': product.owned}" v-if="product && collection">
        <icon name="lock" v-if="!collection.available" class="absolute top-4 left-4 text-secondary" />
        <img
            class="w-full object-cover cursor-pointer"
            :src="image"
            @click="goToCollection"
            :alt="product.getName(languageKey)"
        />
        <div class="w-full p-4 bg-white flex flex-col flex-grow justify-between border-t border-gray-300 dark:bg-secondary dark:border-none">
            <div class="flex justify-between items-start mb-4">
                <h4 class="font-bold">
                    {{ product.getName(languageKey) }}
                </h4>
            </div>
            <div class="flex justify-between items-center text-gray-500 text-sm mb-4 dark:text-gray-400">
                <price class="text-gray-400" v-if="!product.owned" :product="product" :country="languageKey" />
                <base-button
                    class="ml-2"
                    theme="tertiary"
                    icon="buy"
                    :disabled="inCart || !collection.enabled"
                    v-if="!product.owned"
                    @click="addToCart()"
                    :content="false"
                ></base-button>
            </div>
            <div class="flex flex-col gap-2 md:flex-row">
                <base-button
                    theme="secondary"
                    class="flex-1"
                    @click="goToCollection"
                >
                    {{ $t("common.open") }}
                </base-button>
                <base-button
                    class="flex-1"
                    theme="tertiary"
                    style="border: none"
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

import CollectionSettings from "../CollectionSettings.vue";
import { appSession } from "@/services/session";
// import { notify } from "@/services/notify";

@Options({
    components: {
        CollectionSettings,
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
        // notify("success", this.$t("store.addedToCart"), "buy");
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
