<template>
    <div class="flex flex-col rounded-lg overflow-hidden shadow-md relative" v-if="product && collection">
        <LockClosedIcon v-if="!collection.available" class="w-8 h-8 text-red-800 z-10 absolute top-4 left-4 p-2 rounded-full bg-red-500/20" />
        <CheckIcon v-else-if="collection.available" class="w-8 h-8 text-green-700 z-10 absolute top-4 left-4 p-2 rounded-full bg-green-500/20" />
        <div class="overflow-hidden min-h-[250px] bg-white dark:bg-secondary">
            <img
                loading="lazy"
                class="w-full object-cover cursor-pointer transition hover:scale-105"
                height="250"
                :src="image"
                @click="goToCollection"
                :alt="product.getName(languageKey)"
            />
        </div>
        <div class="w-full p-4 bg-white flex flex-col flex-grow justify-between border-t border-gray-300 dark:bg-secondary dark:border-none">
            <div class="flex justify-between gap-2 items-start mb-4">
                <span>
                    <h2 class="font-bold leading-tight mb-2">
                        {{ product.getName(languageKey) }}
                    </h2>
                    <price class="opacity-50" v-if="!product.owned" :product="product" :country="languageKey" />
                </span>
                <button
                    :title="$t('store_learnMore')"
                    :aria-label="$t('store_learnMore')"
                    class="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
                    @click="goToItem"
                >
                    <InformationCircleIcon class="w-4 h-4" />
                </button>
            </div>
            <base-button
                theme="secondary"
                :disabled="inCart || !collection.enabled"
                v-if="!product.owned"
                @click="addToCart()"
            >
                <template #icon>
                    <ShoppingCartIcon class="w-4 h-4" />
                </template>
                {{ $t('store_addToCart') }}
            </base-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { Product } from "@/classes/product";
import { useStore } from "@/store";

import Price from "./Price.vue";
import { ShoppingCartIcon, CheckIcon, LockClosedIcon } from "@heroicons/vue/solid";
import { InformationCircleIcon } from "@heroicons/vue/outline";

import { appSession } from "@/services/session";

@Options({
    components: {
        Price,
        ShoppingCartIcon,
        CheckIcon,
        LockClosedIcon,
        InformationCircleIcon,
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
