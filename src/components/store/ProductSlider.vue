<template>
    <div class="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ProductCard
            v-for="product in Products"
            :key="product.id"
            :product="product"
        />
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Product } from "@/classes";
import ProductCard from "./ProductCard.vue";

export default defineComponent({
    name: "product-slider",
    components: {
        ProductCard,
    },
    props: {
        products: {
            type: Array as PropType<Product[]>,
        },
    },
    computed: {
        Products() {
            return this.products ?? [];
        },
    },
});
</script>
