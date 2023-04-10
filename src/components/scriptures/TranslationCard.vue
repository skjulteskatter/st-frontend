<template>
    <div v-if="translation" class="border cursor-pointer hover:border-secondary p-4 rounded-md flex gap-2">
        <BookOpenIcon class="w-4 h-4 opacity-50 flex-shrink-0" />
        <span class="text-sm">
            <p>{{ translation.title }}</p>
            <span class="opacity-50">{{ translation.language }}</span>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Translation } from "@/classes/scriptures";
import { BookOpenIcon } from "@heroicons/vue/outline";

export default defineComponent({
    name: "translation-card",
    props: {
        translation: {
            type: Object as PropType<Translation>,
        },
    },
    components: {
        BookOpenIcon,
    },
});
</script>
