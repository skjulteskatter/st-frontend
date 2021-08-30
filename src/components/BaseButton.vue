<template>
    <button
        class="py-2 px-3 text-white cursor-pointer flex justify-center items-center gap-2 rounded-md relative focus:outline-none focus:ring focus:ring-primary ring-offset-2"
        :class="[`button-${theme}`, { 'button-loading': loading, 'button-disabled cursor-not-allowed': disabled }]"
        :disabled="loading || disabled"
        v-bind="$attrs"
    >
        <icon size="18" name="refresh" class="animate-spin inline-block" v-if="loading" />
        <icon size="18" v-else-if="icon && !$slots.icon" :name="icon" class="inline-block" />
        <span v-if="$slots.icon">
            <slot name="icon" />
        </span>
        <span class="text-sm" v-if="content">
            <slot />
        </span>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "base-button",
    props: {
        theme: {
            type: String,
            default: "primary",
            validator: (value: string) => {
                return (
                    [
                        "primary",
                        "secondary",
                        "tertiary",
                        "success",
                        "error",
                        "warning",
                    ].indexOf(value) > -1
                );
            },
        },
        loading: {
            type: Boolean,
            default: false,
        },
        loadingLabel: {
            type: String,
            default: "Loading...",
        },
        icon: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        content: {
            type: Boolean,
            default: true,
        },
    },
})
export default class BaseButton extends Vue {
    public loading?: boolean;
    public loadingLabel?: string;
    public theme?: string;
    public icon?: string;
    public disabled?: boolean;
    public content?: boolean;

    public get isLoading() {
        return this.loading;
    }
}
</script>

<style lang="scss" scoped>
.button {
    &:hover {
        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(white, 0.15);
            z-index: 1;
        }
    }

    &--loading {
        animation: buttonLoading 0.5s ease infinite alternate;

        .spinner {
            --st-loader-width: 2px;
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            margin-left: calc(var(--st-spacing) * 0.5);

            border-top: var(--st-loader-width) solid currentColor;
            border-right: var(--st-loader-width) solid currentColor;
            border-bottom: var(--st-loader-width) solid currentColor;
            border-left: var(--st-loader-width) solid transparent;

            animation: loading 1s linear infinite;
        }
    }

    &-disabled {
        opacity: 0.5;
    }

    &-primary {
        background-color: var(--st-color-primary);
    }

    &-secondary {
        background-color: var(--st-color-secondary);
        color: var(--st-color-text-dm);
    }

    &-tertiary {
        @apply text-primary;
        @apply hover:bg-primary/20;
    }

    &-warning {
        background-color: var(--st-color-warning);
    }

    &-success {
        background-color: var(--st-color-success);
    }

    &-error {
        background-color: var(--st-color-error);
    }
}
</style>
