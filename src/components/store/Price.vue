<template>
    <div v-if="product" class="text-sm">
        {{ product.currency?.toUpperCase() }} 
        <span v-if="discounted" class="line-through text-gray-400">{{yearly ? product.originalPrice * 12 : product.originalPrice}}</span>
        <span v-if="discounted" class="ml-1">{{yearly ? product.discountedPrice * 12 : product.discountedPrice}}</span>
        <span v-else>{{yearly ? product.originalPrice * 12 : product.originalPrice}}</span> / {{$t(yearly ? 'year' : 'month').toLowerCase()}}
    </div>
</template>
<script lang="ts">
import { Product } from "@/classes";
import http from "@/services/http";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "price",
    props: {
        product: {
            type: Object,
        },
    },
})
export default class Price extends Vue {
    private store = useStore();
    public product?: Product;
    public country = "no";

    public get yearly() {
        return this.store.state.stripe.type == "year";
    }

    public async mounted() {
        this.country = await http.getCountry();
    }

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
