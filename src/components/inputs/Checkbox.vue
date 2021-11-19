<template>
    <label class="flex items-center">
        <input
            :checked="modelValue"
            @input="$emit('update:modelValue', $event.target.checked)"
            type="checkbox"
            :name="name"
            class="border-gray-300 rounded text-primary focus:ring-primary mr-2"
        />
        <slot/>
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
        name: {
            type: String,
        },
    },
    emits: [
        "update:modelValue",
    ],
})
export default class Checkbox extends Vue {
    public name?: string;
    public modelValue?: boolean;
}
</script>
