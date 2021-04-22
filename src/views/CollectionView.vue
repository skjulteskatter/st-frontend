<template>
    <div v-if="loading" class="loader"></div>
    <div v-else class="collections">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";

@Options({
    name: "store",
})
export default class Store extends Vue {
    private store = useStore();
    public loading = false;
    public loadingSubs = false;

    public async mounted() {
        if (!this.store.getters.stripeInitialized) {
            this.loading = true;
            await this.store.dispatch(StripeActionTypes.SETUP, this.store.state.session.collections);
            this.loading = false;
        }
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.collections {
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }
}
</style>
