<template>
    <div class="p-4 md:p-8">
        <Loader :loading="loading"/>
        <BackButton class="mb-4" />
        <h1 class="text-2xl md:text-3xl font-bold mb-4">{{ $t("common_search") }}</h1>
        <div class="flex flex-col gap-2 mb-4">
            <SearchInput v-model="searchQuery" @search="search" />
            <p class="text-gray-400">{{ (resultCount ?? 0) + ' ' + $t('common_results').toLowerCase() }}</p>
        </div>
        <div class="mb-8" v-if="Contributors.length">
            <h3 class="uppercase tracking-wide mb-2">{{ $t('song_contributors') }}</h3>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SearchResultItemCard v-for="context in Contributors" :key="context.id" :context="context" type="contributor"/>
            </div>
        </div>
        <div v-if="Songs.length">
            <h3 class="uppercase tracking-wide mb-2">{{ $t('common_songs') }}</h3>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SearchResultItemCard v-for="context in Songs" :key="context.id" :context="context" type="song"/>
            </div>
        </div>
        <div v-if="Articles.length">
            <h3 class="uppercase tracking-wide mb-2">{{ $t('common_articles') }}</h3>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SearchResultItemCard v-for="context in Articles" :key="context.id" :context="context" type="article"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BackButton } from "@/components";
import { SearchInput, SearchResultItemCard } from "@/components/inputs";
import { Collection } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { appSession } from "@/services/session";
import { ILocaleString } from "songtreasures";
import { searchService } from "@/services/searchService";
import { SearchResultGroup } from "hiddentreasures-js/build/models/searchResultGroup";
import { application } from "@/classes/application";

export default defineComponent({
    name: "complete-search",
    components: {
        SearchInput,
        SearchResultItemCard,
        BackButton,
    },
    data: () => ({
        store: useStore(),
        loading: false,
    }),
    computed: {
        searchQuery: {
            get() {
                return this.store.state.songs.search;
            },
            set(value: string) {
                this.store.commit(SongsMutationTypes.SEARCH, value);
            },
        },
        searchResult: {
            get() {
                return this.store.state.songs.searchResult;
            },
            set(value: SearchResultGroup) {
                this.store.commit(SongsMutationTypes.SEARCH_RESULT, value);
            },
        },
        Contributors() {
            return this.searchResult?.contributors ?? [];
        },
        Songs() {
            return this.searchResult?.songs ?? [];
        },
        Articles() {
            return this.searchResult?.articles ?? [];
        },
        collections(): Collection[] {
            return appSession.collections as Collection[];
        },
        languageKey() {
            return this.store.getters.languageKey;
        },
        resultCount() {
            return this.Songs.length + this.Contributors.length + this.Articles.length;
        },
    },
    async mounted() {
        application.setTitle(null);
        if (!this.searchResult) {
            await this.search();
        }
    },
    methods: {
        async search() {
            this.loading = true;
            if (this.searchQuery) {
                const result = await searchService.search({
                    query: this.searchQuery,
                });

                this.searchResult = new SearchResultGroup(result);
            }
            this.loading = false;
        },
        localeString(s: ILocaleString) {
            return s[this.languageKey] ?? s.en ?? Object.values(s)[0];
        },
        getCollections(ids: string[]) {
            return this.collections.filter(c => ids.includes(c.id));
        },
        selectSong(collection: string, number: number) {
            this.$router.push({
                name: "song",
                params: {
                    collection: collection,
                    number: number,
                },
            });
        },
    },
});
</script>
