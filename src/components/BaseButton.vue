<template>
    <button
        class="overflow-hidden text-white cursor-pointer flex justify-center items-center gap-2 rounded-md relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 active:text-opacity-50"
        :class="[`button--${theme} button`, { 'opacity-75 cursor-wait button--loading': loading, 'button--disabled': disabled, 'py-1 px-2': size == 'small', 'py-2 px-4': size == 'medium', 'py-3 px-6': size == 'large' }]"
        :disabled="loading || disabled"
        v-bind="$attrs"
    >
        <span
            :class="{ 'text-sm': size == 'medium', 'text-xs': size == 'small', 'text-base': size == 'large' }"
            v-if="$slots.default"
        >
            <slot />
        </span>
        <span v-if="$slots.icon">
            <slot name="icon" />
        </span>
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
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
                        "neutral",
                    ].includes(value)
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
        disabled: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "medium",
            validator: (v: string) => ["small", "medium", "large"].includes(v),
        },
    },
    computed: {
        isLoading() {
            return this.loading;
        },
    },
});
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
            background: rgba(white, 0.1);
            z-index: 1;
        }
    }

    &--primary {
        background-color: var(--st-color-primary);
    }

    &--secondary {
        background-color: var(--st-color-secondary);
    }

    &--tertiary {
        @apply text-primary hover:bg-primary/20 dark:hover:bg-transparent;

        &:hover:after {
            content: "";
            display: none;
        }
    }

    &--warning {
        background-color: var(--st-color-warning);
    }

    &--success {
        background-color: var(--st-color-success);
    }

    &--error {
        background-color: var(--st-color-error);
    }

    &--neutral {
        @apply bg-black/10 dark:bg-white/10 text-gray-800 dark:text-white;
    }

    &--loading {
        &:before {
            content: "";
            background-color: rgba(white, 0.5);

            height: 5px;
            width: 25%;
            border-radius: 1em;

            position: absolute;
            bottom: 0;
            left: -20%;

            animation: buttonLoad 1s linear infinite;
        }
    }

    &--disabled {
        @apply cursor-not-allowed bg-black/10 text-gray-400 dark:bg-white/20 dark:text-gray-400;

        &:hover:after {
            content: "";
            display: none;
        }
    }
}

@keyframes buttonLoad {
    to {
        transform: translateX(500%);
    }
}
</style>
