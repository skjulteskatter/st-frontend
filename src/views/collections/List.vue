<template>
    <div>
        <div class="mb-4 flex justify-between items-center">
            <div class="flex justify-between w-full">
                <div class="flex items-center">
                    <h1 class="font-bold text-xl lg:text-2xl mr-4">{{ $t("common_collections") }}</h1>
                    <Tooltip :text="$t('store_currencyDescription')" />
                </div>
                <StoreCart class="md:hidden" />
            </div>
            <div class="flex gap-2">
                <BaseButton
                    theme="tertiary"
                    @click="refreshSubscriptions"
                    class="refresh-button hidden"
                    :loading="loadingSubs"
                >
                    <template #icon>
                        <RefreshIcon class="h-4 w-4" />
                    </template>
                    {{ $t("common_refreshSubscriptions") }}
                </BaseButton>
                <BaseButton
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
                </BaseButton>
            </div>
        </div>
        <ProductSlider class="mb-4" :products="products" v-if="products.length" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ProductSlider, StoreCart } from "@/components/store";
import { RefreshIcon, CreditCardIcon } from "@heroicons/vue/solid";
import { useStore } from "@/store";
import { notify } from "@/services/notify";
import { Product } from "@/classes";
import { storeService } from "@/services/modules";

export default defineComponent({
    name: "collections-home",
    components: {
        ProductSlider,
        StoreCart,
        RefreshIcon,
        CreditCardIcon,
    },
    data: () => ({
        store: useStore(),
        loading: false,
        loadingSubs: false,
        products: [] as Product[],
    }),
    computed: {
        ownedProducts() {
            return this.products.filter((p) => this.productIds.includes(p.id));
        },
        availableProducts() {
            return this.products.filter((p) => !this.productIds.includes(p.id));
        },
        user() {
            return useStore().getters.user;
        },
        productIds() {
            const ids: string[] = [];

            for (const s of this.user?.subscriptions ?? []) {
                for (const id in s.productIds) {
                    if (!ids.includes(id)) ids.push(id);
                }
            }

            return ids;
        },
    },
    async mounted() {
        this.products = (await storeService.getProducts())
                .sort((a, b) => b.priority - a.priority)
                .filter((p) => p.collections.length == 1) as Product[];
    },
    methods: {
        async portal() {
            this.loading = true;
            window.location.href = await storeService.portal();
        },
        async refreshSubscriptions() {
            this.loadingSubs = true;
            await storeService.refreshSubscriptions();
            this.loadingSubs = false;

            notify("success", this.$t("common_subscriptionsRefreshed"), "check");
        },
    },
});
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
