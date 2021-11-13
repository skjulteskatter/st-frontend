<template>
    <div>
        <div class="mb-4 flex justify-between items-center">
            <div class="flex justify-between w-full">
                <div class="flex items-center">
                    <h1 class="font-bold text-xl lg:text-2xl mr-4">{{ $t("common_collections") }}</h1>
                    <tooltip :text="$t('store_currencyDescription')" />
                </div>
                <store-cart class="md:hidden" />
            </div>
            <div class="flex gap-2">
                <base-button
                    theme="tertiary"
                    @click="refreshSubscriptions"
                    class="refresh-button hidden"
                    :loading="loadingSubs"
                >
                    <template #icon>
                        <RefreshIcon class="h-4 w-4" />
                    </template>
                    {{ $t("common_refreshSubscriptions") }}
                </base-button>
                <base-button
                    v-if="productIds.length"
                    @click="portal"
                    theme="tertiary"
                    :loading="loading"
                    class="manage-button"
                >
                    <template #icon>
                        <CreditCardIcon class="w-4 h-4" />
                    </template>
                    <span class="whitespace-nowrap">
                        {{ $t("common_manage") }}
                        {{ $t("common_subscriptions").toLowerCase() }}
                    </span>
                </base-button>
            </div>
        </div>
        <product-slider class="mb-4" :products="products" v-if="products.length" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { ProductSlider, StoreCart } from "@/components/store";
import { RefreshIcon, CreditCardIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { notify } from "@/services/notify";

@Options({
    components: {
        ProductSlider,
        StoreCart,
        RefreshIcon,
        CreditCardIcon,
    },
    name: "collections-home",
})
export default class StoreHome extends Vue {
    private store = useStore();
    public loading = false;
    public loadingSubs = false;

    public async portal() {
        this.loading = true;
        await this.store.dispatch(StripeActionTypes.GET_PORTAL).then((result) => {
            window.location = (result as unknown) as Location;
        });
        // this.loading = false;
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

        notify("success", this.$t("common_subscriptionsRefreshed"), "check");
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

@include breakpoint("small") {
    .refresh-button,
    .manage-button {
        .button__content {
            display: none;
        }
    }
}
</style>