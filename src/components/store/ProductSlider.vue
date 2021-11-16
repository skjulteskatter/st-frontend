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
import { Product } from "@/classes";
import { Options, Vue } from "vue-class-component";
import ProductCard from "./ProductCard.vue";

@Options({
    props: {
        products: {
            type: Array,
        },
    },
    components: {
        ProductCard,
    },
    name: "product-slider",
})
export default class ProductSlider extends Vue {
    public products?: Product[];

    public get Products() {
        return this.products ?? [];
    }
}
</script>
