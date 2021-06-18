<template>
    <div
        :class="['loader', position == 'global' ? 'loader--global' : '']"
        v-if="Loading"
    >
        <strong class="loader__text">{{ $t("common.loading") }}</strong>
    </div>
    <slot v-else />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "loader",
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        position: {
            type: String,
            default: "global",
            validator(value: string) {
                return ["global", "local"].includes(value);
            },
        },
    },
})
export default class Loader extends Vue {
    public loading?: boolean;
    public position?: string;

    public get Loading() {
        return this.loading === true;
    }
}
</script>

<style lang="scss" scoped>
.loader {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    z-index: 9;

    &:before {
        --size: 50px;
        content: "";
        width: var(--size);
        height: var(--size);

        border-radius: 100%;
        border-bottom: 10px solid var(--st-color-primary);
        border-top: 10px solid var(--st-color-primary);
        border-left: 10px solid var(--st-color-primary);
        border-right: 10px solid transparent;

        animation: loading 1s infinite ease-in-out;
    }

    &--global {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    &__text {
        margin-top: var(--st-spacing);
    }
}
</style>
