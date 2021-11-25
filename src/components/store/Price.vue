<template>
    <div v-if="product" class="text-sm">
        {{ product.currency?.toUpperCase() }} 
        <span v-if="discounted" class="line-through text-gray-400">{{yearly ? product.originalPrice * 12 : product.originalPrice}}</span>
        <span v-if="discounted" class="ml-1">{{yearly ? product.discountedPrice * 12 : product.discountedPrice}}</span>
        <span v-else>{{yearly ? product.originalPrice * 12 : product.originalPrice}}</span> / {{$t(yearly ? 'year' : 'month').toLowerCase()}}
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Product } from "@/classes";
import http from "@/services/http";
import { useStore } from "@/store";

export default defineComponent({
    name: "price",
    props: {
        product: {
            type: Object as PropType<Product>,
        },
    },
    data: () => ({
        store: useStore(),
        country: "no",
    }),
    computed: {
        yearly() {
            return this.store.state.stripe.type == "year";
        },
        Country() {
            return this.country ?? "";
        },
        discounted() {
            return this.product?.discounted(this.Country) === true;
        },
        Price() {
            return this.product?.price;
        },
    },
    async mounted() {
        this.country = await http.getCountry();
    },
});
</script>
