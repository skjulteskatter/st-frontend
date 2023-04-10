<template>
    <div>
        <BackButton class="mb-4" />
        <div class="grid gap-4 lg:grid-cols-3" v-if="product">
            <div>
                <img
                    class="rounded-md shadow-lg w-full"
                    :src="image"
                    :alt="product.getName()"
                />
            </div>
            <BaseCard class="p-4 lg:col-span-2">
                <h1 class="text-xl md:text-2xl font-bold">
                    {{ product.getName() }}
                </h1>
                <div class="opacity-50 py-2">
                    <suspense>
                        <template #fallback>{{ $t("common_loading") }}</template>
                        <template #default>
                            <PriceDiv :product="product" :country="country" />
                        </template>
                    </suspense>
                </div>
                <div class="mb-4">
                    <BaseButton
                        theme="secondary"
                        :disabled="inCart || !collections[0].enabled"
                        v-if="!product.owned"
                        @click="addToCart()"
                    >
                        <template #icon>
                            <ShoppingCartIcon class="w-4 h-4" />
                        </template>
                        {{ $t("store_addToCart") }}
                    </BaseButton>
                    <span class="opacity-50" v-else>
                        {{ $t("store_alreadyOwned") }}
                    </span>
                </div>
                <h3 class="font-bold text-lg mt-8" v-if="details">{{ $t('store_about') }}</h3>
                <div v-html="details" class="flex flex-col gap-2 text-sm"></div>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BackButton } from "@/components";
import { appSession } from "@/services/session";
import http from "@/services/http";
import { Price as PriceDiv} from "@/components/store";
import { ShoppingCartIcon } from "@heroicons/vue/solid";
import { Product } from "@/classes";
import { storeService } from "@/services/modules";

export default defineComponent({
    name: "collection-item",
    components: {
        BackButton,
        PriceDiv,
        ShoppingCartIcon,
    },
    data: () => ({
        loading: false,
        country: "",
        product: null as Product | null,
    }),
    computed: {
        image() {
            return this.product?.collections[0].image + "?w=400";
        },
        collections() {
            return appSession.collections.filter((c) =>
                this.product?.collectionIds.includes(c.id),
            );
        },
        inCart() {
            return this.product
                ? storeService.cart.includes(this.product.id)
                : false;
        },
        details() {
            return this.collections[0].getDetails();
        },
    },
    async mounted() {
        this.product = (await storeService.getProducts()).find((p) => p.id == this.$route.params.id) ?? null;
        this.country = await http.getCountry();
    },
    methods: {
        addToCart() {
            if (this.product) {
                storeService.addProduct(this.product.id);
            }
        },
    },
});
</script>
