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
import { storeService } from "@/services/modules";

export default defineComponent({
    name: "price-div",
    props: {
        product: {
            type: Object as PropType<Product>,
            required: true,
        },
    },
    async setup() {
        const country = await http.getCountry();
        return {
            country,
        };
    },
    data: () => ({
        storeService,
    }),
    computed: {
        yearly() {
            return this.storeService.type === "year";
        },
        discounted() {
            return this.product?.discounted(this.country) === true;
        },
    },
});
</script>
