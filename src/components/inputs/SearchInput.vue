<template>
    <div class="flex relative border-none p-0 bg-transparent w-full">
        <input
            type="text"
            class="rounded border-gray-300 w-full focus:border-primary focus:ring focus:ring-primary focus:ring-offset-2"
            :placeholder="$t('common.search')"
            :value="modelValue"
            @input="(event) => $emit('update:modelValue', event.target.value)"
            @keydown.enter="$emit('search')"
        />
        <icon
            class="absolute top-1/2 right-2 opacity-50 transform -translate-y-1/2"
            name="search"
            size="18"
            @click="$emit('search')"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "search-input",
    props: {
        modelValue: {
            type: String,
        },
    },
    emits: ["search", "update:modelValue"],
})
export default class SearchInput extends Vue {
    public modelValue = "";
}
</script>
