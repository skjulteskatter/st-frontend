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
            <h3 class="all-collections-card__title">
                {{ product.name[languageKey] }}
            </h3>
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
})
export default class AllCollectionsCard extends Vue {
    public product?: Product;
    public action = () => undefined;
    public userStore = useStore(sessionKey);

    public get images(): string[] {
        return this.product?.collections.map(
            (collection) => collection.image + "?w=400"
        ) ?? [];
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
        min-height: 170px;
        border-radius: 0.5rem;
        border: 3px solid var(--st-color-background-light);
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
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }

    &__price {
        opacity: 0.5;
        margin: 0;
    }

    &__title {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &__subtitle {
        opacity: 0.7;
    }
}
</style>