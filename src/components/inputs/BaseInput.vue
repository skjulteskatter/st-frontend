<template>
    <label class="border-none p-0 bg-transparent">
        <small class="block uppercase tracking-wide text-xs mb-1" v-if="label">{{ label }}</small>
        <input
            class="w-full px-3 py-2 rounded-md border border-black/20 dark:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
            v-bind="$attrs"
            :value="modelValue"
            :disabled="disabled"
            :placeholder="placeholder"
            @input="(event) => $emit('update:modelValue', event.target.value)"
        />
    </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
