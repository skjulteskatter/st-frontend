<template>
    <div class="flex flex-col rounded-lg overflow-hidden shadow-md" :class="{'border border-red-700': isAvailable}" v-if="product">
        <img
            class="w-full object-cover cursor-pointer"
            :src="image"
            @click="goToCollection"
            :alt="product.getName(languageKey)"
        />
        <div class="w-full p-4 bg-white flex flex-col flex-grow justify-between border-t border-gray-300">
            <div class="flex justify-between mb-4">
                <h4 class="font-bold">
                    {{ product.getName(languageKey) }}
                </h4>
                <base-button
                    theme="tertiary"
                    icon="buy"
                    :disabled="inCart"
                    v-if="!isOwned"
                    @click="addToCart()"
                    :content="false"
                ></base-button>
                <collection-settings v-else :collection="product.collections[0]"></collection-settings>
            </div>
            <div class="flex flex-col gap-2 md:flex-row">
                <base-button
                    theme="secondary"
                    class="flex-1"
                    icon="arrowRight"
                    @click="goToCollection"
                >
                    {{ $t("common.open") }}
                </base-button>
                <base-button
                    class="flex-1"
                    theme="tertiary"
                    style="border: none"
                    @click="goToItem"
                >
                    {{ $t("store.readmore") }}
                </base-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { Product } from "@/classes/product";
import { useStore } from "@/store";

import CollectionSettings from "../CollectionSettings.vue";
import { Icon } from "@/components/icon";
import { StripeMutationTypes } from "@/store/modules/stripe/mutation-types";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";
import { appSession } from "@/services/session";

@Options({
    components: {
        CollectionSettings,
        Icon,
    },
    name: "product-card",
    props: {
        product: {
            type: Object,
        },
    },
})
export default class ProductCard extends Vue {
    public product?: Product;
    public store = useStore();
    
    public addToCart() {
        if (this.product)
            this.store.commit(
                StripeMutationTypes.CART_ADD_PRODUCT,
                this.product.id,
            );

        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            icon: "buy",
            title: this.$t("store.addedToCart"),
        });
    }

    public get inCart() {
        return this.product
            ? this.store.state.stripe.cart.includes(this.product.id)
            : false;
    }


    public goToCollection() {
        const collectionKey = this.collection?.key;

        if (collectionKey) {
            this.$router.push({
                name: "song-list",
                params: {
                    collection: collectionKey,
                },
            });
        } else {
            this.goToItem();
        }
    }

    public goToItem() {
        if (this.product) {
            this.$router.push({
                name: "collection-item",
                params: {
                    id: this.product.id,
                },
            });
        }
    }

    public get isAvailable() {
        return this.collection?.available;
    }

    public get isOwned() {
        return this.store.getters.user?.subscriptions.some(s => s.collectionIds.includes(this.collection?.id as string));
    }

    public get image() {
        return this.collection?.image
            ? `${this.collection?.image}?w=300&q=50`
            : "/img/placeholder.png";
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        return appSession.collections.find(
            (c) => c.id == this.product?.collectionIds[0],
        );
    }
}
</script>
