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
                    v-if="collections.some(c => c.owned)"
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
        <CollectionSlider class="mb-4" :collections="collections" v-if="collections.length > 0">
            <div class="bg-white dark:bg-secondary shadow-md rounded-lg overflow-hidden">
                <img src="/img/Tutorials.png" alt="" class="w-full cursor-pointer" @click="$router.push({ name: 'tutorials' })">
                <div class="border-t border-gray-300 dark:bg-secondary dark:border-none p-4">
                    <div class="flex gap-4 justify-between items-center">
                        <h3 class="font-bold">Tutorials</h3>
                        <!-- <span class="uppercase text-xs rounded-md bg-green-500/20 px-2 py-1 text-green-700">{{ $t("free") }}</span> -->
                    </div>
                    <p class="opacity-50 mt-2 text-sm">Learn how to play with our free tutorials!</p>
                </div>
            </div>
        </CollectionSlider>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CollectionSlider, StoreCart } from "@/components/store";
import { RefreshIcon, CreditCardIcon } from "@heroicons/vue/solid";
import { notify } from "@/services/notify";
import { storeService } from "@/services/modules";
import { appSession } from "@/services/session";
import collectionService from "@/services/collectionService";
import CollectionView from "@/classes/views/collectionView";

export default defineComponent({
    name: "collections-home",
    components: {
        CollectionSlider,
        StoreCart,
        RefreshIcon,
        CreditCardIcon,
    },
    data: () => ({
        loading: false,
        loadingSubs: false,
        collections: [] as CollectionView[],
    }),
    computed: {
        user() {
            return appSession.user;
        },
    },
    async mounted() {
        this.collections = (await collectionService.list()).filter(c => c.type === "song").map(i => new CollectionView(i));

        await Promise.all(this.collections.map(i => i.load));
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
