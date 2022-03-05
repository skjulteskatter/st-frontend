<script setup lang="ts">
import { computed } from "vue";
import ArticleCard from "./ArticleCard.vue";
import { ArrowSmRightIcon } from "@heroicons/vue/solid"
import { Publication, Article } from "hiddentreasures-js";

interface Props {
    publication: Publication;
    articles?: Article[] | null;
}

interface Emits {
    (event: "clicked"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const Articles = computed(() => {
    return (props.articles ?? []).sort((a, b) => a.number - b.number);
});

function onClick() {
    emit("clicked");
}
</script>

<template>
    <div>
        <BaseCard class="mb-4">
            <div class="flex justify-between items-center">
                <h2>{{ publication.title }}</h2>
                <BaseButton @click="onClick" theme="secondary">
                    {{ $t("common_readHere") }}
                    <template #icon>
                        <ArrowSmRightIcon class="w-4 h-4" />
                    </template>
                </BaseButton>
            </div>
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
});
</script>
