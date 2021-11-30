<template>
    <label class="flex items-center">
        <input
            :checked="modelValue"
            @input="$emit('update:modelValue', $event.target.checked)"
            type="checkbox"
            :name="name"
            class="border-gray-300 rounded text-primary focus-visible:ring-primary mr-2"
        />
        <slot/>
    </label>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "checkbox",
    props: {
        modelValue: {
            type: Boolean,
        },
        name: {
            type: String,
        },
    },
    emits: [
        "update:modelValue",
    ],
});
</script>
