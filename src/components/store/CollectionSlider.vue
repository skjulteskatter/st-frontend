<template>
    <div class="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div 
            class="flex flex-col rounded-lg overflow-hidden shadow-md relative" 
            v-for="v in collections" 
            :key="v.item.id"
        >
            <LockClosedIcon v-if="!v.item.owned" class="w-8 h-8 text-red-800 absolute top-4 left-4 p-2 rounded-full bg-red-500/20" />
            <CheckIcon v-else-if="v.item.owned" class="w-8 h-8 text-green-700 absolute top-4 left-4 p-2 rounded-full bg-green-500/20" />
            <div class="overflow-hidden min-h-[250px] bg-white dark:bg-secondary">
                <img
                    loading="lazy"
                    class="w-full object-cover cursor-pointer"
                    height="250"
                    :src="image(v.item)"
                    @click="goToCollection(v.item)"
                    :alt="v.item.title"
                />
            </div>
            <div class="w-full p-4 bg-white flex flex-col flex-grow justify-between border-t border-gray-300 dark:bg-secondary dark:border-none">
                <div class="flex justify-between gap-2 items-start mb-4">
                    <span>
                        <h2 class="font-bold leading-tight mb-2">{{ v.item.title }}</h2>
                        <suspense>
                            <template #fallback>{{ $t("common_loading") }}</template>
                            <template #default>
                                <Price class="opacity-50" v-if="!v.item.owned && v.product" :product="v.product" />
                            </template>
                        </suspense>
                    </span>
                    <button
                        :title="$t('store_learnMore')"
                        :aria-label="$t('store_learnMore')"
                        class="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
                        @click="goToItem(v.item)"
                    >
                        <InformationCircleIcon class="w-4 h-4" />
                    </button>
                </div>
                <BaseButton
                    theme="secondary"
                    :disabled="!v.item.enabled"
                    v-if="v.product && !v.product.owned"
                    @click="addToCart(v.product)"
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
import { IProduct, ICollection, Collection } from "hiddentreasures-js";
import { storeService } from "@/services/modules";
import CollectionView from "@/classes/views/collectionView";
import { computed } from "vue";
import Price from "./Price.vue";

defineProps<{
    collections: CollectionView[];
}>();

const image = (collection: ICollection) => (collection.image ? `${collection.image}?w=300&q=50` : "/img/placeholder.png");

const addToCart = (product: IProduct | null) => {
    if (product)
        storeService.addProduct(product.id);
};

const goToItem = (collection: ICollection) => {
    router.push({
        name: "collection-item",
        params: {
            id: collection.id,
        },
    });
};

const goToCollection = (collection: ICollection) => {
    const collectionKey = collection.key;
    if (collectionKey) {
        router.push({
            name: "song-list",
            params: {
                collection: collectionKey,
            },
        });
    } else {
        goToItem(collection);
    }
};
</script>
