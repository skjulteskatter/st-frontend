<template>
    <div class="store">
        <div class="store__header">
            <h1 class="store__title">{{ $t("common.store") }}</h1>
            <div class="store__header__buttons">
                <base-button
                    theme="tertiary"
                    @click="refreshSubscriptions"
                    icon="refresh"
                    class="refresh-button"
                    :loading="loadingSubs"
                >
                    <span>
                        {{ $t("common.refreshSubscriptions") }}
                    </span>
                </base-button>
                <base-button
                    v-if="productIds.length"
                    @click="portal"
                    theme="tertiary"
                    :loading="loading"
                    icon="collection"
                    class="manage-button"
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
                :action="
                    () =>
                        $router.push({
                            name: 'store-item',
                            params: { id: product.id },
                        })
                "
                :isPurchaseable="!productIds.includes(product.id)"
            ></store-card>
        </div>
        <div class="store__items">
            <all-collections-card
                v-if="allCollectionProduct"
                :key="allCollectionProduct.id"
                :product="allCollectionProduct"
                :action="
                    () =>
                        $router.push({
                            name: 'store-item',
                            params: {
                                id: allCollectionProduct
                                    ? allCollectionProduct.id
                                    : '',
                            },
                        })
                "
                :isPurchaseable="!productIds.includes(allCollectionProduct.id)"
            ></all-collections-card>
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
import { StoreCard, AllCollectionsCard } from "@/components/store";

@Options({
    components: {
        BaseCard,
        BaseButton,
        StoreCard,
        AllCollectionsCard,
    },
})
export default class Store extends Vue {
    private store = useStore(stripeKey);
    private notifications = notificationStore;
    public loading = false;
    public loadingSubs = false;

    public mounted() {
        if (!this.store.state.initialized) {
            this.store.dispatch("setup");
        }
    }

    // public checkout(product: Product) {
    //     this.loading = true;
    //     this.notifications.dispatch("addNotification", {
    //         type: "primary",
    //         icon: "shop",
    //         title: this.$t("notification.redirecting"),
    //     });
    //     const price = product.prices.find((p) => p.type == "year");

    //     if (price) {
    //         this.store.dispatch("startSession", price.id);
    //         this.loading = false;
    //     }
    // }

    public portal() {
        this.loading = true;
        this.store.dispatch("getPortal").then((result) => {
            window.location = result;
        });
        this.loading = false;
    }

    public get products() {
        return this.store.state.products
            .sort((a, b) => b.priority - a.priority)
            .filter((p) => p.collections.length == 1);
    }

    public get user() {
        return useStore(sessionKey).state.currentUser;
    }

    public get productIds() {
        return this.user?.subscriptions.map((s) => s.productId) ?? [];
    }

    public async refreshSubscriptions() {
        this.loadingSubs = true;
        await this.store.dispatch("refreshCollections");
        this.loadingSubs = false;
    }

    public get allCollectionProduct() {
        return this.store.state.products.find((p) => p.collections.length > 1);
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.store {
    // padding: calc(var(--st-spacing) * 2);

    // @include breakpoint("medium") {
    //     padding: var(--st-spacing);
    // }

    &__title {
        margin: 0;
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--st-spacing);

        padding: calc(var(--st-spacing) * 2);
        padding-bottom: 0;
        @include breakpoint("medium") {
            padding: var(--st-spacing);
            padding-bottom: 0;
        }

        &__buttons {
            display: flex;
            gap: calc(var(--st-spacing) / 2);
        }

        @include breakpoint("small") {
            .refresh-button,
            .manage-button {
                .button__content {
                    display: none;
                }
            }
        }
    }

    hr {
        border: 1px solid var(--st-color-border);
        margin: var(--st-spacing) 0;
    }

    &__items {
        display: grid;
        grid-template-columns: repeat(7, minmax(130px, 1fr));
        grid-gap: var(--st-spacing);
        overflow-x: auto;

        padding: 0 calc(var(--st-spacing) * 2) calc(var(--st-spacing) * 2)
            calc(var(--st-spacing) * 2);
        @include breakpoint("medium") {
            padding: 0 var(--st-spacing) var(--st-spacing) var(--st-spacing);
        }
    }
}
</style>