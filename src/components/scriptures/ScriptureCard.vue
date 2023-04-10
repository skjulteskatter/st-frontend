<template>
    <BaseCard v-if="scripture">
        <template #header>
            {{scripture.title.default}}
        </template>
    </BaseCard>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Collection } from "@/classes";

export default defineComponent({
    name: "scripture-card",
    props: {
        scripture: {
            type: Object as PropType<Collection>,
        },
    },
});
</script>
