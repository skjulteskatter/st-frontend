<template>
    <Loader :loading="loading">
        <BaseCard @click="view" class="hover:ring-2 hover:ring-gray-400 cursor-pointer">
            <div class="flex gap-2" v-if="type === 'song'">
                <b class="text-gray-400">{{ Song.number }}</b>
                <div class="flex flex-col gap-2">
                    <div>
                        <b>{{
                            Song.getName()
                        }}</b>
                        <small class="block text-xs text-primary" v-for="c in Song.Collections" :key="c.id">{{c.getName()}}</small>
                    </div>
                    <div class="text-sm leading-normal text-gray-400 flex flex-col">
                        <small v-if="Song.yearWritten">{{ Song.yearWritten }}</small>
                        <small 
                            v-for="con in Song.Participants"
                            :key="con.id"
                        >{{ con.name }}</small>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 flex-col" v-if="type === 'contributor'">
                <UserCircleIcon class="w-6 h-6 opacity-50" />
                <div class="flex flex-col gap-2">
                    <div>
                        <b>{{
                            Contributor?.item.name ?? context.context["name"]
                        }}</b>
                        <small class="block text-xs text-primary">{{$t('song_contributor')}}</small>
                    </div>
                    <div class="text-sm text-gray-400 flex flex-col">
                        <small v-if="Contributor?.item.subtitle">{{ Contributor.item.subtitle }}</small>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 flex-col" v-if="type === 'article' && article">
                <PencilIcon class="w-6 h-6 opacity-50" />
                <div class="flex flex-col gap-2">
                    <div>
                        <b>{{article.title}}</b>
                        <small class="block text-xs text-primary">{{$t('common_article')}}</small>
                    </div>
                    <!-- <div class="text-sm text-gray-400 flex flex-col">
                        <small v-if="Contributor.item.subtitle">{{ Contributor.item.subtitle }}</small>
                    </div> -->
                </div>
            </div>
        </BaseCard>
    </Loader>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { UserCircleIcon, PencilIcon } from "@heroicons/vue/outline";
import { CollectionItem, Song } from "@/classes";
import { ApiContributor } from "songtreasures-api";
import { Article } from "hiddentreasures-js";
import { SearchResult } from "hiddentreasures-js/build/models/searchResultGroup";
import { articleService, publicationService } from "@/services/publications";
import { appSession } from "@/services/session";

export default defineComponent({
    props: {
        context: {
            type: Object as PropType<SearchResult>,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    components: {
        UserCircleIcon,
        PencilIcon,
    },
    computed: {
        Song() {
            return appSession.songs.find(i => i.id === this.context.id) as Song;
        },
        Contributor() {
            return appSession.contributors.find(i => i.id === this.context.id) as CollectionItem<ApiContributor>;
        },
    },
    data: () => ({
        article: null as Article | null,
        loading: true,
    }),
    async mounted() {
        if (this.type === "article") {
            this.article = await articleService.get(this.context.id);
        }
        this.loading = false;
    },
    methods: {
        view() {
            switch(this.type) {
                case "article":
                    publicationService.get(this.article?.publicationId ?? "").then(p => {
                        const collection = appSession.getCollection(p.collectionId);

                        this.$router.push({
                            name: "article-list",
                            params: {
                                collectionId: collection?.keys.default,
                                publicationId: p.id,
                            },
                        });
                    });
                    break;
                
                case "song":
                    this.Song.view();
                    break;

                case "contributor":
                    this.$router.push({
                        name: "contributor",
                        params: {
                            contributor: this.context.id,
                        },
                    });
            }
        },
    },
    name: "search-result-item",
});
</script>
