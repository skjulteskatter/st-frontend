<template>
    <div v-if="collection" class="bg-white shadow-md dark:bg-secondary">
        <img class="mx-auto object-center" v-if="collection.image" :src="collection.image" />
        <div class="prose prose-md" v-if="collection.header" v-html="collection.header">
        </div>
        <h1 
            class="text-lg mr-8 text-right align-text-bottom" 
            v-if="publication"
        >
            {{publication.title}}
        </h1>
        <hr/>
        <Loader :loading="loading.articles || loading.publication">
            <div class="columns-sm p-4 gap-4">
                <ArticleCard
                    class="mb-6"
                    v-for="article in articles"
                    ref="articles"
                    :id="'article-' + article.id"
                    :key="article.id"
                    :article="article"
                ></ArticleCard>
            </div>
        </Loader>
    </div>
</template>
<script lang="ts">
import ArticleCard from "@/components/publications/ArticleCard.vue";
import { Publication, Article, Collection } from "hiddentreasures-js";
import collectionService from "@/services/collectionService";
import { defineComponent } from "vue";
import { articleService, publicationService } from "@/services/publications";

export default defineComponent({
    components: {
        ArticleCard,
    },
    name: "articles-list",
    data: () => ({
        collection: null as Collection | null,
        publication: null as Publication | null,
        articles: null as Article[] | null,
        loading: {
            articles: false,
            publication: false,
        },
    }),
    async mounted() {
        const {collectionId, publicationId, articleId} = this.$route.params;
        this.collection = (await collectionService.list()).find(i => i.containsKey(collectionId as string)) ?? null;
        console.log(this.collection);
        this.publication = await publicationService.get(publicationId as string);
        this.loading.publication = false;
        this.articles = (await articleService.retrieve({
            parentIds: [publicationId as string],
            withContent: true,
        })).sort((a, b) => a.number - b.number);
        this.loading.articles = false;
        setTimeout(() => {
            if (articleId && typeof(articleId) === "string") {
                const el = document.getElementById("article-" + articleId);

                if (el) {
                    window.scrollTo(0, el.offsetTop - 20);

                    el.classList.toggle("article-select");
                }
            }
        }, 50);
    },
});
</script>
<style lang="scss">

</style>
