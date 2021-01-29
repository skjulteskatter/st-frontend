<template>
    <div class="card" :class="{ 'card-border': border }">
        <div
            v-if="image"
            class="card__image"
            :style="{ backgroundImage: `url(${image})` }"
        ></div>
        <div class="card__content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        border: {
            type: Boolean,
        },
        image: {
            type: String,
        },
    },
})
export default class Card extends Vue {
    public border = false;
    public image = "";
}
</script>

<style lang="scss" scoped>
.card {
    background: var(--st-background-color);
    border-radius: var(--st-border-radius);
    overflow: hidden;
    animation: slideInFromBottom 0.3s ease;

    &[secondary] {
        background: transparent;
    }

    &-border {
        border: 1px solid var(--st-border-color);
    }

    &__image {
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        width: 100%;
        min-height: 150px;
    }

    &__content {
        padding: var(--st-spacing);

        & > :first-child {
            margin-top: 0;
        }
    }
}
</style>
