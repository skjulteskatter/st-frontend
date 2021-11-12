<template>
    <label class="checkbox">
        <input
            :checked="modelValue"
            @input="$emit('update:modelValue', $event.target.checked)"
            type="checkbox"
            :name="label"
            class="border-gray-300 rounded text-primary focus:ring-primary"
        />
        {{ label }}
    </label>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "checkbox",
    props: {
        modelValue: {
            type: Boolean,
        },
        label: {
            type: String,
        },
    },
    emits: [
        "update:modelValue",
    ],
})
export default class Checkbox extends Vue {
    public label?: string;
    public modelValue?: boolean;
}
</script>
