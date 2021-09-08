<template>
    <label class="border-none p-0 bg-transparent">
        <small class="block tracking-wide" v-if="label">{{ label }}</small>
        <input
            class="px-2 py-1 text-base rounded-md border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary w-full dark:border-gray-500 dark:bg-secondary"
            v-bind="$attrs"
            :value="modelValue"
            :disabled="disabled"
            :placeholder="placeholder"
            @input="(event) => $emit('update:modelValue', event.target.value)"
        />
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
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
        },
    },
    emits: ["update:modelValue"],
})
export default class BaseInput extends Vue {
    public label?: string;
    public modelValue?: string;
    public disabled?: boolean;
    public placeholder?: string;
}
</script>
