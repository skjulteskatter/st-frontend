<template>
    <div>
        <div v-for="product in products" :key="product.id" @click="checkout(product.id)">{{product.name}}</div>
        <button @click="portal()">Portal</button>
    </div>
</template>

<script lang="ts">
import { stripeKey } from "@/store/stripe";
import { Vue } from "vue-class-component";
import { useStore } from "vuex";

export default class Stripe extends Vue{
    private store = useStore(stripeKey);

    public mounted() {
        if (!this.store.state.initialized) {
            this.store.dispatch('setup');
        }
    }

    public checkout(priceId: string) {
        this.store.dispatch('startSession', priceId);
    }

    public portal() {
        this.store.dispatch('getPortal').then(result => {
            window.location = result;
        });
    }

    public get products() {
        return this.store.state.products;
    }
}
</script>

<style>

</style>