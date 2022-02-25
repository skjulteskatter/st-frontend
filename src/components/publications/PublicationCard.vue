<script setup lang="ts">
import { computed } from "vue";
import ArticleCard from "./ArticleCard.vue";
import { Publication, Article } from "hiddentreasures-js";

interface Props {
    publication: Publication;
    articles?: Article[] | null;
}

const props = defineProps<Props>();

const Articles = computed(() => {
    return (props.articles ?? []).sort((a, b) => a.number - b.number);
});
</script>
<template>
    <div>
        <BaseCard class="mb-4">
            <template #header>
                {{publication.title}}
                <BaseButton @click="clicked">Read</BaseButton>
            </template>
        </BaseCard>
        <div v-if="Articles.length > 0">
            <ArticleCard
                class="mb-2"
                v-for="article in Articles"
                :key="article.id"
                :article="article"
            ></ArticleCard>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "publication-card",
    methods: {
        clicked() {
            this.$emit("clicked");
        },
    },
    emits: [
        "clicked",
    ],
});
</script>
