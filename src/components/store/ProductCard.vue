<template>
    <div class="flex flex-col rounded-lg overflow-hidden shadow-md relative" v-if="product && collection">
        <LockClosedIcon v-if="!collection.available" class="w-5 h-5 text-secondary z-10 absolute top-4 left-4" />
        <CheckCircleIcon v-else-if="collection.available" class="w-5 h-5 text-green-700 z-10 absolute top-4 left-4" />
        <div class="overflow-hidden min-h-[250px] bg-white dark:bg-secondary">
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
                    :disabled="inCart || !collection.enabled"
                    v-if="!product.owned"
                    @click="addToCart()"
                >
                    <template #icon>
                        <ShoppingCartIcon class="w-4 h-4" />
                    </template>
                    {{ $t('store.addToCart') }}
                </base-button>
                <base-button
                    class="flex-grow"
                    theme="tertiary"
                    @click="goToItem"
                >
                    {{ $t("store.learnMore") }}
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
import { ShoppingCartIcon, CheckCircleIcon, LockClosedIcon } from "@heroicons/vue/solid";

import { appSession } from "@/services/session";

@Options({
    components: {
        Price,
        ShoppingCartIcon,
        CheckCircleIcon,
        LockClosedIcon,
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
