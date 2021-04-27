<template>
    <div class="collections">
        <loader :loading="loading">
            <router-view />
        </loader>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { Loader } from "@/components";

@Options({
    name: "store",
    components: {
        Loader,
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
                this.store.state.session.collections
            );
            this.loading = false;
        }
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.collections {
    padding: calc(var(--st-spacing) * 2);
    height: 100%;

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }
}
</style>
