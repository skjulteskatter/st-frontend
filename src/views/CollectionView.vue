<template>
    <div class="h-full p-4 md:p-8">
        <store-cart class="cart ml-2" />
        <loader :loading="loading">
            <router-view />
        </loader>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { StoreCart } from "@/components/store";

@Options({
    name: "store",
    components: {
        StoreCart,
    },
})
export default class Store extends Vue {
    private store = useStore();
    public loading = false;

    public async mounted() {
        if (!this.store.getters.stripeInitialized) {
            this.loading = true;
            await this.store.dispatch(
                StripeActionTypes.SETUP,
            );
            this.loading = false;
        }
    }
}
</script>

<style lang="scss">
.cart {
    float: right;
}
</style>
