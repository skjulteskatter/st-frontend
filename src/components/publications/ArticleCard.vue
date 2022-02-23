<template>
    <BaseCard>
        <template #header>{{article.title}}</template>
        <img v-if="article.image"
            :src="article.image"
        >
        <div v-if="article.content?.introduction" v-html="article.content?.introduction"></div>
        <hr v-if="article.content?.introduction" />
        <div v-if="article.content" v-html="article.content?.content"></div>
        <template #footer>{{article.Date.toLocaleDateString()}} - {{article.Author?.name}}</template>
    </BaseCard>
</template>
<script setup lang="ts">
import { Article } from "@/classes/publications";

interface Props {
    article: Article;
}

defineProps<Props>();
</script>
