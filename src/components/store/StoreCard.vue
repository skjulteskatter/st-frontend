<template>
    <base-card
        v-if="product"
        class="store-card"
        :image="product.collections[0].image"
        footer
        border
    >
        <h3 class="store-card__title">{{ product.name[languageKey] }}</h3>
        <base-button
            class="store-card__button"
            v-if="isPurchaseable"
            :action="action"
            >{{ $t("store.buy") }}</base-button
        >
        <span class="store-card__subtitle" v-else>{{
            $t("store.alreadyown")
        }}</span>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";

@Options({
    components: {
        BaseCard,
        BaseButton,
    },
    props: {
        product: {
            type: Object,
        },
        isPurchaseable: {
            type: Boolean,
        },
        action: {
            type: Function,
        },
    },
})
export default class StoreCard extends Vue {
    public product?: Product;
    public isPurchaseable = false;
    public action = () => undefined;
    public userStore = useStore(sessionKey);
    private loading = false;

    public get languageKey() {
        return this.userStore.getters.languageKey ?? "en";
    }
}
</script>

<style lang="scss">
.store-card {
    display: flex;

    &__button {
        align-self: flex-end;
    }

    &__title {
        margin-top: 0;
    }

    &__subtitle {
        opacity: 0.7;
    }

    .card__content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
    }
}
</style>