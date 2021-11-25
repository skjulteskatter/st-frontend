<template>
    <BaseCard v-if="scripture">
        <template #header>
            {{scripture.title.default}}
        </template>
    </BaseCard>
</template>
<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Scripture } from "@/classes/scriptures";

export default defineComponent({
    name: "scripture-card",
    props: {
        scripture: {
            type: Object as PropType<Scripture>,
        },
    },
});
</script>
