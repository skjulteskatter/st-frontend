<template>
    <div class="store">
        <div class="store__title gap-x">
            <h1>{{ $t("common.store") }}</h1>
            <base-button
                v-if="user.subscriptions.length"
                :action="portal"
                theme="secondary"
                :loading="loading"
            >
                {{
                    `${$t("common.manage")} ${$t(
                        "common.subscriptions"
                    ).toLowerCase()}`
                }}
            </base-button>
        </div>
        <div class="store__items">
            <base-card
                v-for="product in products"
                :key="product.id"
                :image="product.collections[0].image"
                class="store__items__item"
                border
            >
                <h3>{{ product.name.no }}</h3>
                <base-button
                    class="store__items__item__button"
                    v-if="!productIds.includes(product.id)"
                    :action="() => checkout(product)"
                    :loading="loading"
                    >{{ $t("common.buy") }}</base-button
                >
                <label style="opacity: 0.6" v-else>{{
                    $t("store.alreadyown")
                }}</label>
            </base-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { stripeKey } from "@/store/stripe";
import { sessionKey } from "@/store";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";

@Options({
    components: {
        BaseCard,
        BaseButton,
    },
})
export default class Stripe extends Vue {
    private store = useStore(stripeKey);
    public loading = false;

    public mounted() {
        if (!this.store.state.initialized) {
            this.store.dispatch("setup");
        }
    }

    public checkout(product: Product) {
        this.loading = true;
        const price = product.prices.find((p) => p.type == "month");

        if (price) {
            this.store.dispatch("startSession", price.id);
            this.loading = false;
        }
    }

    public portal() {
        this.loading = true;
        this.store.dispatch("getPortal").then((result) => {
            window.location = result;
        });
        this.loading = false;
    }

    public get products() {
        return this.store.state.products.sort(
            (a, b) => b.collections.length - a.collections.length
        );
    }

    public get user() {
        return useStore(sessionKey).state.currentUser;
    }

    public get productIds() {
        return this.user.subscriptions.map((s) => s.productId);
    }
}
</script>

<style lang="scss">
.store {
    &__title {
        display: flex;
        align-items: center;
        // gap: var(--st-spacing);
    }
    &__items {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: var(--st-spacing);

        @media screen and (max-width: 600px) {
            grid-template-columns: 1fr;
        }

        &__item {
            display: flex;

            &__button {
                align-self: flex-end;
            }

            .card__content {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;
                width: 100%;

                h3 {
                    margin-top: 0;
                }
            }
        }
    }
}
</style>