<template>
    <label class="base-input">
        <small class="base-input__label" v-if="label">{{ label }}</small>
        <input
            type="text"
            class="base-input__input"
            v-bind="$attrs"
            :value="modelValue"
            @input="(event) => $emit('update:modelValue', event.target.value)"
        />
    </label>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        label: {
            type: String,
        },
        modelValue: {
            type: String,
        },
    },
    emits: ["update:modelValue"],
})
export default class BaseInput extends Vue {
    public label = "";
    public modelValue = "";
}
</script>

<style lang="scss">
.base-input {
    &__label {
        display: block;
        margin-bottom: 0.5rem;
    }

    &__input {
        width: 100%;
    }
}
</style>