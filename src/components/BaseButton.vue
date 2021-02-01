<template>
    <button
        class="button"
        :class="[`button-${theme}`, { 'button-loading': loading }]"
        @click="action"
        :disabled="loading"
    >
        <span class="button__label-loading" v-if="loading">{{
            loadingLabel
        }}</span>
        <span class="spinner" v-if="loading"></span>
        <span class="button__content" v-else>
            <slot></slot>
        </span>
    </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        theme: {
            type: String,
            validator: (value: string) => {
                return (
                    [
                        "primary",
                        "secondary",
                        "success",
                        "error",
                        "warning",
                    ].indexOf(value) > -1
                );
            },
        },
        action: {
            type: Function,
        },
        loading: {
            type: Boolean,
        },
        loadingLabel: {
            type: String,
        },
    },
})
export default class BaseButton extends Vue {
    public loading = false;
    public action: Function = () => undefined;
    public loadingLabel = "Loading...";
    public theme = "primary";

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
    display: inline-block;

    &-loading {
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
        background-color: var(--st-primary-color);
    }

    &-secondary {
        background-color: var(--st-background-color);
        border: 1px solid var(--st-border-color);
        color: var(--st-text-color);
    }

    &-warning {
        background-color: var(--st-warning-color);
    }

    &-success {
        background-color: var(--st-success-color);
    }

    &-error {
        background-color: var(--st-error-color);
    }
}
</style>