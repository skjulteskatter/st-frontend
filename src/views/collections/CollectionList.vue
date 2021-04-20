<template>
    <div class="collections__header">
        <h1 class="collections__title">{{ $t("common.collections") }}</h1>
        <div class="collections__header__buttons">
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
    <div class="collections__owned">
        <product-slider :products="products" v-if="products.length" />
        <!-- <all-collections-card
            v-if="allCollectionProduct"
            :product="allCollectionProduct"
            :action="
                () =>
                    $router.push({
                        name: 'collection-item',
                        params: {
                            id: allCollectionProduct
                                ? allCollectionProduct.id
                                : '',
                        },
                    })
            "
        ></all-collections-card> -->
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { BaseButton } from "@/components";
import { AllCollectionsCard, ProductSlider } from "@/components/store";
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";

@Options({
    components: {
        BaseButton,
        AllCollectionsCard,
        ProductSlider,
    },
    name: "collections-home",
})
export default class StoreHome extends Vue {
    private store = useStore();
    public loading = false;
    public loadingSubs = false;

    public mounted() {
        if (!this.store.getters.stripeInitialized) {
            this.store.dispatch(StripeActionTypes.SETUP);
        }
    }

    public portal() {
        this.loading = true;
        this.store.dispatch(StripeActionTypes.GET_PORTAL).then((result) => {
            window.location = (result as unknown) as Location;
        });
        this.loading = false;
    }

    public get products() {
        return this.store.getters.products
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
        return useStore().getters.user;
    }

    public get productIds() {
        return this.user?.subscriptions.map((s) => s.productId) ?? [];
    }

    public async refreshSubscriptions() {
        this.loadingSubs = true;
        await this.store.dispatch(StripeActionTypes.REFRESH_COLLECTIONS);
        this.loadingSubs = false;
    }

    public get allCollectionProduct() {
        return this.store.getters.products.find(
            (p) => p.collections.length > 1
        );
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.collections {
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
        max-width: 1200px;

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
