<template>
    <div class="store__header">
        <h1 class="store__title">{{ $t("common.collections") }}</h1>
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
    <div class="store__owned">
        <!-- <p class="store__owned__title">
                {{ $t("common.your") }}
                {{ $t("common.collections").toLowerCase() }}
            </p> -->
        <product-slider :products="products" v-if="products.length">
            <all-collections-card
                v-if="allCollectionProduct"
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
            ></all-collections-card>
        </product-slider>
    </div>
    <!-- <div class="store__available" v-if="availableProducts.length">
            <p class="store__available__title">
                {{ $t("common.available") }}
                {{ $t("common.collections").toLowerCase() }}
            </p>
            <product-slider :products="availableProducts"></product-slider>
        </div> -->
</template>

<script lang="ts">
import { notificationStore, sessionKey, stripeKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

import { BaseButton } from "@/components";
import {
    StoreCard,
    AllCollectionsCard,
    ProductSlider,
} from "@/components/store";

@Options({
    components: {
        BaseButton,
        StoreCard,
        AllCollectionsCard,
        ProductSlider,
    },
})
export default class StoreHome extends Vue {
    private store = useStore(stripeKey);
    private notifications = notificationStore;
    public loading = false;
    public loadingSubs = false;

    public mounted() {
        if (!this.store.state.initialized) {
            this.store.dispatch("setup");
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
        return this.store.state.products
            .sort((a, b) => b.priority - a.priority)
            .filter((p) => p.collections.length == 1);
    }

    public get ownedProducts() {
        return this.products.filter((p) => this.productIds.includes(p.id));
    }

    public get availableProducts() {
        return this.products.filter((p) => !this.productIds.includes(p.id));
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
@import "../../style/mixins";

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

    &__owned,
    &__available {
        margin-bottom: 2rem;

        & > * {
            padding: 0 calc(var(--st-spacing) * 2) calc(var(--st-spacing) * 2)
                calc(var(--st-spacing) * 2);
            @include breakpoint("medium") {
                padding: 0 var(--st-spacing) var(--st-spacing) var(--st-spacing);
            }
        }

        &__title {
            margin: 0;
            padding-bottom: 0;
            margin-bottom: 0.5em;
            font-size: 1em;
        }
    }

    &__items {
        display: grid;
        grid-template-columns: repeat(8, minmax(130px, 1fr));
        grid-gap: var(--st-spacing);
        overflow-x: auto;
    }
}
</style>