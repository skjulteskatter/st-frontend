<template>
    <div class="all-collections-card" v-if="product">
        <div class="all-collections-card__image">
            <img
                v-for="image in images"
                :key="image"
                :src="image"
                :alt="product?.getName(languageKey)"
            />
        </div>
        <div class="all-collections-card__footer">
            <h4 class="all-collections-card__title">
                {{ product.name[languageKey] }}
            </h4>
            <base-button
                class="all-collections-card__button"
                icon="info"
                theme="primary"
                @click="action"
            >
                <span>{{ $t("store.seemore") }}</span>
            </base-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";

import { BaseCard, BaseButton } from "@/components";
import { Icon } from "@/components/icon";
import { Product } from "@/classes/product";

@Options({
    components: {
        BaseCard,
        BaseButton,
        Icon,
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
    name: "all-collections-card",
})
export default class AllCollectionsCard extends Vue {
    public product?: Product;
    public action = () => undefined;
    public userStore = useStore(sessionKey);

    public get images(): string[] {
        return (
            this.product?.collections.map(
                (collection) => collection.image + "?w=300&q=50"
            ) ?? []
        );
    }

    public get languageKey() {
        return this.userStore.getters.languageKey ?? "en";
    }
}
</script>

<style lang="scss">
@import "../../style/mixins";

.all-collections-card {
    animation: slideInFromBottom 250ms;
    display: flex;
    flex-direction: column;
    background: var(--st-color-background-medium);
    border-radius: var(--st-border-radius);
    overflow: hidden;

    @include breakpoint("small") {
        .all-collections-card__price {
            display: none;
        }
    }

    &__button {
        flex-shrink: 0;
    }

    &__image {
        max-width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;

        img {
            width: 25%;
            object-fit: cover;
            flex-shrink: 1;
        }
    }

    &__footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: var(--st-spacing);
        background: var(--st-color-background-light);
        flex-grow: 1;
    }

    &__price {
        opacity: 0.5;
        margin: 0;
    }

    &__title {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0;
    }

    &__subtitle {
        opacity: 0.7;
    }
}
</style>
