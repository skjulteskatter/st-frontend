<template>
    <div class="w-full bg-white shadow lg:w-1/3 overflow-auto">
        <ul class="w-full divide-y-2 divide-gray-100">
            <li
                v-for="(item, i) in Items" 
                :key="i" 
                @click="clickCallback ? clickCallback(item) : undefined"
                class="p-4 hover:bg-gray-50 cursor-pointer"
            >
                {{nameSelector ? nameSelector(item) : item}}
            </li>
            <slot v-if="Items.length === 0" />
        </ul>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
    name: "base-list",
    props: {
        items: {
            type: Array,
        },
        nameSelector: {
            type: Function as PropType<(i: unknown) => string>,
        },
        clickCallback: {
            type: Function as PropType<(i: unknown) => void>,
        },
    },
    computed: {
        Items() {
            return this.items ?? [];
        },
    },
});
</script>
