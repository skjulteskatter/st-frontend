<template>
    <button
        class="overflow-hidden py-2 px-3 text-white cursor-pointer flex justify-center items-center gap-2 rounded-md relative focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
        :class="[`button-${theme} button`, { 'opacity-75 cursor-wait': loading, 'cursor-not-allowed opacity-50': disabled }]"
        :disabled="loading || disabled"
        v-bind="$attrs"
    >
        <span class="loader" v-if="loading" />
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

.loader {
    background-color: rgba(white, .5);
    height: 5px;
    width: 50px;
    position: absolute;
    bottom: 0%;
    animation: buttonLoad 1s linear infinite;
}

@keyframes buttonLoad {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}
</style>
