<template>
    <div class="text-justify prose prose-sm dark:prose-invert mx-auto">
        <h3 class="font-bold">{{ article.title }}</h3>
        <img class="h-48 m-4 float-left" v-if="article.image" :src="article.image" />
        <em v-if="article.content?.introduction" v-html="article.content?.introduction"></em>
        <div v-if="article.content" v-html="article.content?.content"></div>
        <i class="opacity-80">
            {{ new Date(article.dateWritten).toLocaleDateString() }} - {{ author?.name }}
        </i>
    </div>
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
