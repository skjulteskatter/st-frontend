<template>
    <div class="product-slider">
        <product-card
            v-for="product in products"
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
    public products: Product[] = [];
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.product-slider {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: var(--st-spacing);
}
</style>
