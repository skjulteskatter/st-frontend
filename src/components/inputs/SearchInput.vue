<template>
    <div class="flex relative">
        <input
            type="text"
            class="p-2 rounded border border-gray-300 w-full"
            :placeholder="$t('common.search')"
            :value="modelValue"
            @input="(event) => $emit('update:modelValue', event.target.value)"
            @keydown.enter="$emit('search')"
        />
        <Icon
            class="absolute top-1/2 right-2 opacity-50 transform -translate-y-1/2"
            name="search"
            size="18"
            @click="$emit('search')"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";

@Options({
    name: "search-input",
    components: {
        Icon,
    },
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
