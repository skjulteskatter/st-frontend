<template>
    <div class="bg-white rounded-lg shadow-md dark:bg-secondary overflow-hidden">
        <div class="p-4 border-b border-gray-300 dark:border-gray-500" v-if="$slots.header">
            <slot name="header" />
        </div>
        <div class="p-4 h-full">
            <slot name="default" />
        </div>
        <div class="p-4 bg-gray-100 dark:bg-black/20" v-if="$slots.footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    name: "base-card",
})
export default class Card extends Vue {}
</script>
