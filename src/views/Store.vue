<template>
    <div class="store">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";

import {
    StoreCard,
    AllCollectionsCard,
    ProductSlider,
} from "@/components/store";
import { useStore } from "@/store/typed";
import { StripeActionTypes } from "@/store/typed/modules/stripe/action-types";

@Options({
    components: {
        BaseButton,
        StoreCard,
        AllCollectionsCard,
        ProductSlider,
    },
    name: "store",
})
export default class Store extends Vue {
    private store = useStore();
    public loading = false;
    public loadingSubs = false;

    public mounted() {
        if (!this.store.getters.stripeInitialized) {
            this.store.dispatch(StripeActionTypes.SETUP);
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
        this.store.dispatch(StripeActionTypes.GET_PORTAL).then((result) => {
            window.location = result as unknown as Location;
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
        return this.store.getters.user;
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
        return this.store.getters.products.find((p) => p.collections.length > 1);
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
