<template>
    <div class="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div 
            class="flex flex-col rounded-lg overflow-hidden shadow-md relative" 
            v-for="p in data" 
            :key="p.product.id"
        >
            <LockClosedIcon v-if="!p.collection.owned" class="w-8 h-8 text-red-800 absolute top-4 left-4 p-2 rounded-full bg-red-500/20" />
            <CheckIcon v-else-if="p.collection.owned" class="w-8 h-8 text-green-700 absolute top-4 left-4 p-2 rounded-full bg-green-500/20" />
            <div class="overflow-hidden min-h-[250px] bg-white dark:bg-secondary">
                <img
                    loading="lazy"
                    class="w-full object-cover cursor-pointer"
                    height="250"
                    :src="image(p.collection)"
                    @click="goToCollection(p.product, p.collection)"
                    :alt="p.product.name"
                />
            </div>
            <div class="w-full p-4 bg-white flex flex-col flex-grow justify-between border-t border-gray-300 dark:bg-secondary dark:border-none">
                <div class="flex justify-between gap-2 items-start mb-4">
                    <span>
                        <h2 class="font-bold leading-tight mb-2">{{ p.product.name }}</h2>
                        <suspense>
                            <template #fallback>{{ $t("common_loading") }}</template>
                            <template #default>
                                <Price class="opacity-50" v-if="!p.product.owned" :product="p.product" />
                            </template>
                        </suspense>
                    </span>
                    <button
                        :title="$t('store_learnMore')"
                        :aria-label="$t('store_learnMore')"
                        class="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
                        @click="goToItem(p.product)"
                    >
                        <InformationCircleIcon class="w-4 h-4" />
                    </button>
                </div>
                <BaseButton
                    theme="secondary"
                    :disabled="!p.collection.enabled"
                    v-if="!p.product.owned"
                    @click="addToCart(p.product)"
                >
                    <template #icon>
                        <ShoppingCartIcon class="w-4 h-4" />
                    </template>
                    {{ $t('store_addToCart') }}
                </BaseButton>
            </div>
        </div>
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { CheckIcon, InformationCircleIcon, LockClosedIcon, ShoppingCartIcon } from "@heroicons/vue/outline";
import router from "@/router";
const image = (collection: Collection) => (collection.image ? `${collection.image}?w=300&q=50` : "/img/placeholder.png");

const addToCart = (product: ApiProduct) => {
    storeService.addProduct(product.id);
};

const goToItem = (product: ApiProduct) => {
    router.push({
        name: "collection-item",
        params: {
            id: product.id,
        },
    });
};

const goToCollection = (product: ApiProduct, collection: ICollection) => {
    const collectionKey = collection?.key;
    if (collectionKey) {
        router.push({
            name: "song-list",
            params: {
                collection: collectionKey,
            },
        });
    } else {
        goToItem(product);
    }
};
</script>
<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Product } from "@/classes";
import collectionService from "@/services/collectionService";
import { Collection, ICollection } from "hiddentreasures-js";
import { storeService } from "@/services/modules";
import { ApiProduct } from "songtreasures-api/checkout";
import { Price } from "..";

export default defineComponent({
    name: "product-slider",
    props: {
        products: {
            type: Array as PropType<Product[]>,
            required: true,
        },
    },
    data: () => ({
        data: null as {
            product: Product;
            collection: Collection;
        }[] | null,
    }),
    async mounted() {
        const collections = await collectionService.list();
        this.data = this.products.map(p => ({
            product: p,
            collection: collections.find(c => p.collectionIds.includes(c.id)) as Collection,
        }));
    },
});
</script>
