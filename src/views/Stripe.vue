<template>
    <div class="store">
        <div class="store__title">
            <h1>Store</h1>    
            <button @click="portal()" secondary>Manage subscriptions</button>
        </div>
        <div class="store__items">
            <card v-for="product in products" :key="product.id" :image="product.image" class="store__items__item">
                <h3>{{product.name.no}}</h3>
                <button @click="checkout(product.priceId)">Buy</button>
            </card>
        </div>
    </div>
</template>

<script lang="ts">
import { stripeKey } from "@/store/stripe";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import Card from '@/components/Card.vue';

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