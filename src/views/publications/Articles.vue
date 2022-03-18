<script setup lang="ts">
import { articleService, publicationService } from "@/services/publications";
import ArticleCard from "@/components/publications/ArticleCard.vue";
import { reactive } from "vue";
import { Publication, Article } from "hiddentreasures-js";
import { appSession } from "@/services/session";
import { useRoute } from "vue-router";

const { publicationId, collectionId } = useRoute().params;

const data = reactive({
    articles: [] as Article[],
    publication: null as Publication | null,
});

const loading = reactive({
    publication: true,
    articles: true,
});

const collection = appSession.getCollection(collectionId as string);

publicationService.get(publicationId as string).then(r => {
    data.publication = r;
    loading.publication = false;
});

articleService.retrieve({
    parentIds: [publicationId as string],
    withContent: true,
}).then(a => {
    data.articles = a.sort((a, b) => a.number - b.number);
    loading.articles = false;
});
</script>
<template>
    <div v-if="collection" class="bg-white shadow-md dark:bg-secondary">
        <img class="mx-auto object-center" v-if="collection.image" :src="collection.image" />
        <h1 
            class="text-lg mr-8 text-right align-text-bottom" 
            v-if="data.publication"
        >
            {{data.publication.title}}
        </h1>
        <hr/>
        <Loader :loading="loading.articles || loading.publication">
            <div class="columns-sm p-4 gap-4">
                <ArticleCard
                    class="mb-6"
                    v-for="article in data.articles"
                    :key="article.id"
                    :article="(article as Article)"
                ></ArticleCard>
            </div>
        </Loader>
    </div>
</template>
<style lang="scss">
</style>
