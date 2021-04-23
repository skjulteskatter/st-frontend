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
            <store-cart />
        </div>
    </div>
    <!-- <product-slider :products="products" v-if="products.length" /> -->
    <div class="collections__owned">
        <product-slider :products="products" v-if="products.length" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { BaseButton } from "@/components";
import { ProductSlider, StoreCart } from "@/components/store";
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";

@Options({
    components: {
        BaseButton,
        ProductSlider,
        StoreCart,
    },
    name: "collections-home",
})
export default class StoreHome extends Vue {
    private store = useStore();
    public loading = false;
    public loadingSubs = false;

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
        const ids: string[] = [];

        for (const s of this.user?.subscriptions ?? []) {
            for (const id in s.productIds) {
                if (!ids.includes(id)) ids.push(id);
            }
        }

        return ids;
    }

    public async refreshSubscriptions() {
        this.loadingSubs = true;
        await this.store.dispatch(StripeActionTypes.REFRESH_COLLECTIONS);
        this.loadingSubs = false;
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.collections {
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
