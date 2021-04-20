<template>
    <div v-if="loading" class="loader"></div>
    <div v-else class="collections">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";

import { useStore } from "@/store";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";

@Options({
    components: {
        BaseButton,
    },
    name: "store",
})
export default class Store extends Vue {
    private store = useStore();
    public loading = false;
    public loadingSubs = false;

    public async mounted() {
        if (!this.store.getters.stripeInitialized) {
            this.loading = true;
            await this.store.dispatch(StripeActionTypes.SETUP);
            this.loading = false;
        }
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.collections {
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
