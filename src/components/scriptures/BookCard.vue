<template>
    <BaseCard v-if="book">
        <h1>{{book.title}}</h1>
    </BaseCard>
</template>
<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Book } from "@/classes/scriptures";

export default defineComponent({
    name: "book-card",
    props: {
        book: {
            type: Object as PropType<Book>,
        },
    },
});
</script>
