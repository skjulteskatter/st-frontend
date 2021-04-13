<template>
    <div class="product-slider">
        <store-card
            v-for="product in products"
            :key="product.id"
            :product="product"
            :action="
                () =>
                    $router.push({
                        name: 'store-item',
                        params: { id: product.id },
                    })
            "
        ></store-card>
        <slot />
    </div>
</template>

<script lang="ts">
import { Product } from "@/classes/product";
import { Options, Vue } from "vue-class-component";
import StoreCard from "./StoreCard.vue";

@Options({
    props: {
        products: {
            type: Array,
        },
    },
    components: {
        StoreCard,
    },
    name: "product-slider"
})
export default class ProductSlider extends Vue {
    public products: Product[] = [];
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.product-slider {
    display: grid;
    grid-template-columns: repeat(4, minmax(130px, 1fr));
    grid-gap: var(--st-spacing);
    overflow-x: auto;

    padding: 0 calc(var(--st-spacing) * 2) calc(var(--st-spacing) * 2)
        calc(var(--st-spacing) * 2);
    @include breakpoint("medium") {
        padding: 0 var(--st-spacing) var(--st-spacing) var(--st-spacing);
    }

    @include breakpoint("small") {
        grid-template-columns: repeat(8, minmax(130px, 1fr));
        overflow-x: scroll;
    }
}
</style>