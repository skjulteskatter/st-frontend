<template>
    <button
        class="button"
        :class="[`button-${theme}`, { 'button-loading': loading }]"
        :disabled="loading"
        v-bind="$attrs"
    >
        <span class="button__label--loading" v-if="loading">{{
            loadingLabel
        }}</span>
        <span class="spinner" v-if="loading"></span>
        <span class="button__content" v-else>
            <slot></slot>
        </span>
        <icon size="18" v-if="icon" :name="icon" class="button__icon" />
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";

@Options({
    name: "base-button",
    components: {
        Icon,
    },
    props: {
        theme: {
            type: String,
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
        },
        loadingLabel: {
            type: String,
        },
        icon: {
            type: String,
        },
    },
})
export default class BaseButton extends Vue {
    public loading = false;
    public loadingLabel = "Loading...";
    public theme = "primary";
    public icon = "";

    public get isLoading() {
        return this.loading;
    }
}
</script>

<style lang="scss" scoped>
.button {
    padding: calc(var(--st-spacing) * 0.5) var(--st-spacing);
    border-radius: var(--st-border-radius);
    color: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
    // display: inline-block;

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

    &__content {
        z-index: 2;
    }

    &__icon {
        display: inline-block;
    }

    &--loading {
        animation: buttonLoading 0.5s ease infinite alternate;
        display: flex;
        align-items: center;

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

    &-primary {
        background-color: var(--st-color-primary);
    }

    &-secondary {
        background-color: var(--st-color-secondary);
        color: var(--st-color-text-dm);
    }

    &-tertiary {
        background-color: transparent;
        border: 1px solid var(--st-color-primary);
        color: var(--st-color-primary);

        &:hover {
            background-color: var(--st-color-primary);
            color: var(--st-color-text-dm);

            &:after {
                background: transparent;
            }
        }
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