<template>
    <BaseCard>
        <template #header>{{article.title}}</template>
        <div v-if="article.content" v-html="article.content?.content"></div>
        <template #footer>{{article.Date.toLocaleDateString()}} - {{article.Author?.name}}</template>
    </BaseCard>
</template>
<script lang="ts">
import Article from "@/classes/publications/article";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: "article-card",
    props: {
        article: {
            type: Object as PropType<Article>,
            required: true,
        },
    },
});
</script>
