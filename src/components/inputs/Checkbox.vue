<template>
    <label class="checkbox">
        <input
            v-bind:checked="value"
            @input="$emit('input', $event.target.checked)"
            ref="input"

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
        value: {
            type: Boolean,
        },
        label: {
            type: String,
        },
    },
    emits: [
        "input",
    ],
})
export default class Checkbox extends Vue {
    public label?: string;
    public value?: boolean;
}
</script>
