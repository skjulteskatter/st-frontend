<template>
    <div class="flex flex-col rounded-lg overflow-hidden shadow-md relative" v-if="product && collection">
        <LockClosedIcon v-if="!collection.available" class="w-8 h-8 text-red-800 absolute top-4 left-4 p-2 rounded-full bg-red-500/20" />
        <CheckIcon v-else-if="collection.available" class="w-8 h-8 text-green-700 absolute top-4 left-4 p-2 rounded-full bg-green-500/20" />
        <div class="overflow-hidden min-h-[250px] bg-white dark:bg-secondary">
            <img
                loading="lazy"
                class="w-full object-cover cursor-pointer"
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
            <BaseButton
                theme="secondary"
                :disabled="inCart || !collection.enabled"
                v-if="!product.owned"
                @click="addToCart()"
            >
                <template #icon>
                    <ShoppingCartIcon class="w-4 h-4" />
                </template>
                {{ $t('store_addToCart') }}
            </BaseButton>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Product } from "@/classes";
import { useStore } from "@/store";
import Price from "./Price.vue";
import { ShoppingCartIcon, CheckIcon, LockClosedIcon } from "@heroicons/vue/solid";
import { InformationCircleIcon } from "@heroicons/vue/outline";
import { appSession } from "@/services/session";

export default defineComponent({
    name: "product-card",
    components: {
        Price,
        ShoppingCartIcon,
        CheckIcon,
        LockClosedIcon,
        InformationCircleIcon,
    },
    props: {
        product: {
            type: Object as PropType<Product>,
        },
    },
    data: () => ({
        store: useStore(),
    }),
    computed: {
        inCart() {
            return this.product
                ? this.store.state.stripe.cart.includes(this.product.id)
                : false;
        },
        isAvailable() {
            return this.collection?.available;
        },
        image() {
            return this.collection?.image
                ? `${this.collection?.image}?w=300&q=50`
                : "/img/placeholder.png";
        },
        languageKey() {
            return this.store.getters.languageKey;
        },
        collection() {
            return appSession.collections.find(
                (c) => c.id == this.product?.collectionIds[0],
            );
        },
    },
    methods: {
        addToCart() {
            this.collection?.addToCart();
        },
        goToCollection() {
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
        },
        goToItem() {
            if (this.product) {
                this.$router.push({
                    name: "collection-item",
                    params: {
                        id: this.product.id,
                    },
                });
            }
        },
    },
});
</script>
