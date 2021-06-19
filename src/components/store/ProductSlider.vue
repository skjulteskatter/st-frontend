<template>
    <div class="gap-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <product-card
            v-for="product in Products"
            :key="product.id"
            :product="product"
        ></product-card>
        <slot />
    </div>
</template>

<script lang="ts">
import { Product } from "@/classes/product";
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
