<template>
    <div v-if="collection">
        <h1 class="text-2xl font-bold mb-4">{{ collection.name.default }}</h1>
        <Loader :loading="loading">
            <PublicationCard
                class="mb-2"
                v-for="publication in publications"
                :key="publication.id"
                :publication="publication"
                @clicked="$router.push({
                    name: 'article-list',
                    params: {
                        publicationId: publication.id,
                    },
                })"
            />
        </Loader>
    </div>
</template>
<script lang="ts" setup>
import { PublicationCard } from "@/components/publications";
import { useRoute } from "vue-router";
import { appSession } from "@/services/session";
import { computed, reactive } from "vue";
import { publicationService } from "@/services/publications";
import { Publication } from "hiddentreasures-js";

const route = useRoute();

const collectionId = route.params.collectionId as string;
const collection = appSession.collection(collectionId);

const publications = computed(() => data.publications);
const loading = computed(() => data.loading);

const data = reactive({
    publications: [] as Publication[],
    loading: false,
});

publicationService.retrieve({
    parentIds: [collection.id],
}).then(r => {
    data.publications = r;
    data.loading = false;
});
</script>
