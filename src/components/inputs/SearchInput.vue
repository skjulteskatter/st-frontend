<template>
    <div class="flex relative border-none p-0 bg-transparent">
        <input
            type="search"
            class="pl-8 py-1 rounded-md bg-black/10 border-none w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:ring-offset-secondary dark:bg-white/10 dark:text-white dark:placeholder-gray-400"
            :class="{ 'cursor-not-allowed opacity-50': disabled }"
            :disabled="disabled"
            :placeholder="placeholder ?? $t('common_search')"
            :value="modelValue"
            @input="(event) => $emit('update:modelValue', event.target.value)"
            @keydown.enter="$emit('search')"
        />
        <SearchIcon
            class="w-4 h-4 absolute top-1/2 left-2 opacity-50 -translate-y-1/2"
            @click="$emit('search')"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SearchIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "search-input",
    props: {
        modelValue: {
            type: String,
        },
        disabled: {
            type: Boolean,
        },
        placeholder: {
            type: String,
        },
    },
    components: {
        SearchIcon,
    },
    emits: ["search", "update:modelValue"],
});
</script>
