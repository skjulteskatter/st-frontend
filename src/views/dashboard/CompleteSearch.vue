<template>
    <div class="p-4 md:p-8">
        <Loader :loading="loading"/>
        <BackButton class="mb-4" />
        <h1 class="text-2xl md:text-3xl font-bold mb-4">{{ $t("common_search") }}</h1>
        <div class="flex flex-col gap-2 mb-4">
            <SearchInput v-model="searchQuery" @search="search" />
            <p class="text-gray-400">{{ (searchResult?.count ?? 0) + ' ' + $t('common_results').toLowerCase() }}</p>
        </div>
        <div class="mb-8" v-if="Contributors.length">
            <h3 class="uppercase tracking-wide mb-2">{{ $t('song_contributors') }}</h3>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SearchResultItemCard @click="item.view()" v-for="item in Contributors" :key="item.id" :item="item"/>
            </div>
        </div>
        <div v-if="Songs.length">
            <h3 class="uppercase tracking-wide mb-2">{{ $t('common_songs') }}</h3>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SearchResultItemCard @click="item.view()" v-for="item in Songs" :key="item.id" :item="item"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BackButton } from "@/components";
import { SearchInput, SearchResultItemCard } from "@/components/inputs";
import api from "@/services/api";
import { Collection, CollectionItem, Song } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import SearchResult from "@/classes/search/searchResult";
import SearchResultItem from "@/classes/search/searchResultItem";
import { ApiContributor } from "songtreasures";
import { appSession } from "@/services/session";

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
            set(value: SearchResult) {
                this.store.commit(SongsMutationTypes.SEARCH_RESULT, value);
            },
        },
        Contributors() {
            return this.searchResult?.contributors as SearchResultItem<CollectionItem<ApiContributor>>[] ?? [];
        },
        Songs() {
            return this.searchResult?.songs as SearchResultItem<Song>[] ?? [];
        },
        collections(): Collection[] {
            return appSession.collections as Collection[];
        },
        languageKey() {
            return this.store.getters.languageKey;
        },
    },
    async mounted() {
        if (!this.searchResult) {
            await this.search();
        }
    },
    methods: {
        async search() {
            this.loading = true;
            if (this.searchQuery) {
                const result = await api.search.search(
                    this.searchQuery,
                );

                this.searchResult = new SearchResult(result);
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
