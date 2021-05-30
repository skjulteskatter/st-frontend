<template>
    <label class="border-none p-0">
        <small class="block" v-if="label">{{ label }}</small>
        <input
            class="rounded border-gray-300 focus:ring focus:ring-primary focus:ring-offset-2 focus:border-primary w-full"
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
