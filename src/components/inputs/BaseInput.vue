<template>
    <label>
        <small class="block mb-1" v-if="label">{{ label }}</small>
        <input
            class="p-2 rounded border border-gray-300 w-full"
            v-bind="$attrs"
            :value="modelValue"
            :disabled="disabled"
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
        },
    },
    emits: ["update:modelValue"],
})
export default class BaseInput extends Vue {
    public label = "";
    public modelValue = "";
    public disabled = false;
}
</script>
