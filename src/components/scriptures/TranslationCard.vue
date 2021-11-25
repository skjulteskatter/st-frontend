<template>
    <BaseCard v-if="translation">
        {{translation.title}}
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Translation } from "@/classes/scriptures";

export default defineComponent({
    name: "translation-card",
    props: {
        translation: {
            type: Object as PropType<Translation>,
        },
    },
});
</script>
