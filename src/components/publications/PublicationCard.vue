<template>
    <BaseCard>
        <template #header>
            {{publication.title}}
            <BaseButton @click="clicked">Read</BaseButton>
        </template>
        <div v-if="articles?.length && articles.length > 0">
            <ArticleCard
                class="mb-2"
                v-for="article in articles"
                :key="article.id"
                :article="article"
            ></ArticleCard>
        </div>
    </BaseCard>
</template>
<script lang="ts">
import { Publication } from "@/classes/publications";
import Article from "@/classes/publications/article";
import { defineComponent, PropType } from "vue";
import ArticleCard from "./ArticleCard.vue";

export default defineComponent({
    name: "publication-card",
    props: {
        publication: {
            type: Object as PropType<Publication>,
            required: true,
        },
        articles: {
            type: Array as PropType<Article[] | null>,
        },
    },
    methods: {
        clicked() {
            this.$emit("clicked");
        },
    },
    emits: [
        "clicked",
    ],
    components: { ArticleCard },
});
</script>
