<template>
    <div class="card" :class="{ 'card-border': border }">
        <div
            v-if="image"
            class="card__image"
            :style="{ backgroundImage: `url(${image})` }"
        ></div>
        <div class="card__header" v-if="header">
            <div>
                <slot name="header" />
            </div>
            <Icon
                class="toggle-button"
                v-if="toggleable"
                :name="isOpen ? 'arrowDown' : 'arrowUp'"
                @click="isOpen = !isOpen"
            />
        </div>
        <div class="card__content" v-if="!(header && isOpen)">
            <slot name="default" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";

@Options({
    props: {
        border: {
            type: Boolean,
        },
        image: {
            type: String,
        },
        header: {
            type: Boolean,
        },
        toggleable: {
            type: Boolean,
        },
    },
    components: {
        Icon,
    },
})
export default class Card extends Vue {
    public border = false;
    public header = false;
    public toggleable = false;
    public image = "";
    private isOpen = false;
}
</script>

<style lang="scss">
.card {
    background: var(--st-color-background-medium);
    border-radius: var(--st-border-radius);
    overflow: hidden;
    // will-change: transform;
    animation: slideInFromBottom 0.3s ease;

    &[secondary] {
        background: transparent;
    }

    &-border {
        border: 1px solid var(--st-color-border);
    }

    &__image {
        background-size: cover;
        background-position-y: 20%;
        background-repeat: no-repeat;

        width: 100%;
        min-height: 150px;
    }

    &__content,
    &__header {
        padding: var(--st-spacing);

        h1,
        h2 {
            margin-top: 0;
        }
    }

    &__header {
        border-bottom: 1px solid var(--st-color-border);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .toggle-button {
            cursor: pointer;
        }
    }
}
</style>
