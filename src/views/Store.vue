<template>
    <div class="store">
        <div class="store__header">
            <h1 class="store__title">{{ $t("common.store") }}</h1>
            <div class="store__header__buttons">
                <base-button
                    theme="secondary"
                    @click="refreshSubscriptions"
                    icon="refresh"
                >
                    <span>
                        {{ $t("common.refreshSubscriptions") }}
                    </span>
                </base-button>
                <base-button
                    v-if="productIds.length"
                    :action="portal"
                    theme="secondary"
                    :loading="loading"
                    icon="collection"
                >
                    <span>
                        {{ $t("common.manage") }}
                        {{ $t("common.subscriptions").toLowerCase() }}
                    </span>
                </base-button>
            </div>
        </div>
        <div class="store__items">
            <store-card
                v-for="product in products"
                :key="product.id"
                :product="product"
                :action="() => checkout(product)"
                :isPurchaseable="!productIds.includes(product.id)"
            ></store-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { stripeKey } from "@/store/stripe";
import { notificationStore, sessionKey } from "@/store";

import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import { StoreCard } from "@/components/store";

@Options({
    components: {
        BaseCard,
        BaseButton,
        StoreCard,
    },
})
export default class Store extends Vue {
    private store = useStore(stripeKey);
    private notifications = notificationStore;
    public loading = false;

    public mounted() {
        if (!this.store.state.initialized) {
            this.store.dispatch("setup");
        }
    }

    public checkout(product: Product) {
        this.loading = true;
        this.notifications.dispatch("addNotification", {
            type: "primary",
            icon: "shop",
            title: this.$t("notification.redirecting"),
        });
        const price = product.prices.find((p) => p.type == "year");

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
        return this.user?.subscriptions.map((s) => s.productId) ?? [];
    }

    public async refreshSubscriptions() {
        await this.store.dispatch("refreshCollections");
    }
}
</script>

<style lang="scss">
.store {
    padding: calc(var(--st-spacing) * 2);

    &__title {
        margin: 0;
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--st-spacing);

        &__buttons {
            display: flex;
            gap: calc(var(--st-spacing) / 2);
        }
    }

    hr {
        border: 1px solid var(--st-border-color);
        margin: var(--st-spacing) 0;
    }

    &__items {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: calc(var(--st-spacing) * 2);

        @media screen and (max-width: 1000px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media screen and (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    }
}
</style>