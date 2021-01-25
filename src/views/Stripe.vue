<template>
    <div class="store">
        <div class="store__title">
            <h1>Store</h1>    
            <button @click="portal()" v-if="user.subscriptions.length" secondary>Manage subscriptions</button>
        </div>
        <div class="store__items">
            <card v-for="product in products" :key="product.id" :image="product.image" class="store__items__item">
                <h3>{{product.name.no}}</h3>
                <button @click="checkout(product)" v-if="!productIds.includes(product.id)">Buy</button>
                <label style="opacity: .6" v-else>You already own this product.</label>
            </card>
        </div>
    </div>
</template>

<script lang="ts">
import { stripeKey } from "@/store/stripe";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import Card from '@/components/Card.vue';
import { sessionKey } from "@/store";

@Options({
    components: {
        Card
    }
})
export default class Stripe extends Vue{
    private store = useStore(stripeKey);

    public mounted() {
        if (!this.store.state.initialized) {
            this.store.dispatch('setup');
        }
    }

    public checkout(product: Product) {
        const price = product.prices.find(p => p.type == 'month');

        if (price) {
            this.store.dispatch('startSession', price.id);
        }
    }

    public portal() {
        this.store.dispatch('getPortal').then(result => {
            window.location = result;
        });
    }

    public get products() {
        return this.store.state.products;
    }

    public get user(){
        return useStore(sessionKey).state.currentUser;
    }

    public get productIds(){
        return this.user.subscriptions.map(s => s.productId)
    }
}
</script>

<style lang="scss">
.store {
    &__title {
        display: flex;
        align-items: center;
        gap: var(--spacing);
    }
    &__items {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing);

        &__item {
            display: flex;
            justify-content: space-between;

            .card__content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;

                h3 {
                    margin-top: 0;
                }
            }
        }
    }
}
</style>