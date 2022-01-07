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
<script lang="ts">
import { Collection } from "@/classes";
import { Publication } from "@/classes/publications";
import Article from "@/classes/publications/article";
import publications from "@/services/modules/publications";
import { appSession } from "@/services/session";
import { defineComponent } from "vue";
import { PublicationCard } from "@/components/publications";

export default defineComponent({
    name: "publication-collection",
    data() {
        return {
            collection: null as Collection | null,
            publications: [] as Publication[],
            loading: true,
            articles: {} as {
                [publicationId: string]: Article[] | null;
            },
        };
    },
    async mounted() {
        const collectionId = this.$route.params.collectionId as string;
        this.collection = appSession.collection(collectionId);
        this.publications = await publications.list(this.collection.id);
        this.loading = false;
    },
    components: { PublicationCard },
    methods: {
        async clickPublication(publication: Publication) {
            if (!this.articles[publication.id]) {
                this.articles[publication.id] = await publications.articles.list(publication.id);
            } else {
                delete this.articles[publication.id];
            }
        },
    },
});
</script>
