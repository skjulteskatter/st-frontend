<template>
    <div class="bg-white rounded-lg shadow-md dark:bg-secondary flex flex-col">
        <div class="px-4 py-3 border-b border-black/10 dark:border-white/10" v-if="$slots.header">
            <slot name="header" />
        </div>
        <div class="p-4 flex-grow" v-if="$slots.default">
            <slot name="default" />
        </div>
        <div class="px-4 py-3 border-t border-black/10 dark:border-white/10" v-if="$slots.footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "BaseCard",
});
</script>
