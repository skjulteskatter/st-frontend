<template>
    <div class="button-group" v-if="buttons.length">
        <button
            class="button-group__button"
            v-for="button in buttons"
            :key="button.label"
            @click="action ? action(button.value) : undefined"
            :class="{
                'button-group__button--selected': button.selected,
            }"
        >
            {{ button.label }}
        </button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        buttons: {
            type: Array,
        },
        action: {
            type: Function,
        },
    },
})
export default class ButtonGroup extends Vue {
    public buttons: 
            {
                label: string;
                value: string;
                selected: boolean;
            }[] = [];
    public action?: Function;
}
</script>

<style lang="scss">
.button-group {
    border-radius: var(--st-border-radius);
    border: 1px solid var(--st-border-color);
    overflow: hidden;

    display: flex;

    &__button {
        color: var(--st-text-color);
        background-color: var(--st-background-color);
        padding: calc(var(--st-spacing) * 0.5);
        border-radius: 0px;

        &--selected {
            background-color: var(--st-primary-color);
            color: white;
        }

        &:not(:last-child) {
            border-right: 1px solid var(--st-border-color);
        }
    }
}
</style>