<template>
    <div v-if="product">
        {{ product.currency?.toUpperCase() }} 
        <span v-if="discounted" class="line-through text-gray-400">{{product.originalPrice}}</span>
        <span v-if="discounted" class="ml-1">{{product.discountedPrice}}</span>
        <span v-else>{{product.originalPrice}}</span> / year
    </div>
</template>
<script lang="ts">
import { Product } from "@/classes";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "price",
    props: {
        product: {
            type: Object,
        },
        country: {
            type: String,
        },
    },
})
export default class Price extends Vue {
    public product?: Product;
    public country?: string;

    public get Country() {
        return this.country ?? "";
    }

    public get discounted() {
        return this.product?.discounted(this.Country) === true;
    }

    public get Price() {
        return this.product?.price;
    }
}
</script>
