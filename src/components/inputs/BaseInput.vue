<template>
    <label class="base-input">
        <small class="base-input__label" v-if="label">{{ label }}</small>
        <input
            v-if="type != 'textarea'"
            class="base-input__input"
            v-bind="$attrs"
            :type="type"
            :value="modelValue"
            :disabled="disabled"
            @input="(event) => $emit('update:modelValue', event.target.value)"
        />
        <textarea
            v-if="type == 'textarea'"
            v-bind="$attrs"
            :value="modelValue"
            @input="(event) => $emit('update:modelValue', event.target.value)"
        ></textarea>
    </label>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "base-input",
    props: {
        label: {
            type: String,
        },
        modelValue: {
            type: String,
        },
        type: {
            type: String,
        },
        disabled: {
            type: Boolean
        }
    },
    emits: ["update:modelValue"],
})
export default class BaseInput extends Vue {
    public label = "";
    public modelValue = "";
    public type = "text";
    public disabled = false;
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