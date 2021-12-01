<template>
    <div class="w-full bg-white shadow lg:w-1/3 overflow-auto">
        <ul class="w-full divide-y-2 divide-gray-100">
            <li
                v-for="(item, i) in items" 
                :key="i" 
                @click="clickCallback ? clickCallback(item) : undefined"
                class="p-4 hover:bg-gray-50 cursor-pointer"
            >
                <span v-if="!previewSelector">
                    {{nameSelector(item)}}
                </span>
                <div v-if="previewSelector">
                    <h3 class="text-lg">{{nameSelector(item)}}</h3>
                    <hr class="mb-2"/>
                    <span class="text-sm" v-html="previewSelector(item)" />
                </div>
            </li>
            <slot v-if="items.length === 0" />
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
            required: true,
        },
        nameSelector: {
            type: Function as PropType<(i: unknown) => string>,
            required: true,
        },
        clickCallback: {
            type: Function as PropType<(i: unknown) => void>,
        },
        previewSelector: {
            type: Function as PropType<(i: unknown) => string>,
        },
    },
});
</script>
