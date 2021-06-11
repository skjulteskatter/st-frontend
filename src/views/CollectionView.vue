<template>
    <div class="p-4 md:p-8">
        <loader :loading="loading">
            <router-view />
        </loader>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";

@Options({
    name: "collection-view",
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
