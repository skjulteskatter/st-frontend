<template>
    <div v-if="collection">
        <BaseCard
            class="mb-2"
        >
            <h3 class="text-lg">{{collection.name.default}}</h3>
        </BaseCard>
        <Loader :loading="loading">
            <PublicationCard
                class="mb-2"
                v-for="publication in publications"
                :key="publication.id"
                :publication="publication"
                :articles="articles[publication.id]"
                @clicked="clickPublication(publication)"
            >
            </PublicationCard>
        </Loader>
    </div>
</template>
<script lang="ts" setup>
import { PublicationCard } from "@/components/publications";
import { useRoute } from "vue-router";
import { appSession } from "@/services/session";
import { ref } from "vue";
import { articleService, publicationService } from "@/services/publications";
import { Article, Publication } from "hiddentreasures-js";
import { ListOptions } from "hiddentreasures-js/build/services/baseChildService";

const route = useRoute();

const collectionId = route.params.collectionId as string;
const collection = appSession.collection(collectionId);

const articles = ref({} as {
    [key: string]: Article[] | undefined;
});
const clickPublication = async (publication: Publication) => {
    if (!articles.value[publication.id]) {
        articles.value[publication.id] = await articleService.retrieve({
            parentIds: [publication.id],
            withContent: true,
        } as ListOptions);
    } else {
        delete articles.value[publication.id];
    }
};

let publications = ref([] as Publication[]);
let loading = ref(false);
publicationService.retrieve({
    parentIds: [collection.id],
}).then(r => {
    publications.value = r;
    loading.value = false;
});
</script>
