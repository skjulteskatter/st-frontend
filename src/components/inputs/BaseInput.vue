<template>
    <label class="border-none p-0 bg-transparent">
        <small class="block tracking-wide" v-if="label">{{ label }}</small>
        <input
            class="px-2 py-1 text-base rounded-md border-black/20 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-full dark:border-white/20 dark:bg-secondary"
            v-bind="$attrs"
            :value="modelValue"
            :disabled="disabled"
            :placeholder="placeholder"
            @input="(event) => $emit('update:modelValue', (event.target as HTMLInputElement).value)"
        />
    </label>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
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
});
</script>
