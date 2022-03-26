<template>
    <div v-if="price" class="text-sm">
        {{ price.currency?.toUpperCase() }} 
        <span v-if="discounted" class="line-through text-gray-400">{{price.value}}</span>
        <span v-if="discounted" class="ml-1">{{price.value}}</span>
        <span v-else>{{price.value}}</span> / {{$t(yearly ? 'year' : 'month').toLowerCase()}}
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Product } from "hiddentreasures-js";
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
        price() {
            return this.product.prices.find(p => p.type === this.storeService.type);
        },
        discounted() {
            return false;
        },
    },
});
</script>
