<template>
    <BaseCard>
        <template #header>{{article.title}}</template>
        <img class="h-40" v-if="article.image"
            :src="article.image"
        >
        <div class="article-introduction" v-if="article.content?.introduction" v-html="article.content?.introduction"></div>
        <hr class="mb-4" v-if="article.content?.introduction" />
        <div class="article-content" v-if="article.content" v-html="article.content?.content"></div>
        <template #footer>{{new Date(article.dateWritten).toLocaleDateString()}} - {{author?.name}}</template>
    </BaseCard>
</template>
<script setup lang="ts">
import { Article, Contributor } from "hiddentreasures-js";
import contributorService from "@/services/contributorService";
import { ref } from "vue";

interface Props {
    article: Article;
}

const props = defineProps<Props>();

const author = ref(null as Contributor | null);

contributorService.get(props.article.authorId).then(r => {
    author.value = r;
});
</script>
<style lang="scss" scoped>
.article-content, .article-introduction {
    line-height: 200%;
}
</style>
