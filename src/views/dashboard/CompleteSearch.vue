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
import { Options, Vue } from "vue-class-component";
import { BackButton } from "@/components";
import { SearchInput, SearchResultItemCard } from "@/components/inputs";

import api from "@/services/api";
import { Collection } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import SearchResult from "@/classes/search/searchResult";

@Options({
    components: {
        SearchInput,
        SearchResultItemCard,
        BackButton,
    },
    name: "complete-search",
})
export default class CompleteSearch extends Vue {
    public store = useStore();
    public loading = false;

    public async mounted() {
        if (!this.searchResult) {
            await this.search();
        }
    }

    public async search() {
        this.loading = true;
        if (this.searchQuery) {
            const result = await api.search.search(
                this.searchQuery,
            );

            this.searchResult = new SearchResult(result);
        }
        this.loading = false;
    }
    
    public localeString(s: ILocaleString) {
        return s[this.languageKey] ?? s.en ?? Object.values(s)[0];
    }

    public getCollections(ids: string[]) {
        return this.collections.filter(c => ids.includes(c.id));
    }

    public get searchQuery() {
        return this.store.state.songs.search;
    }

    public set searchQuery(value) {
        this.store.commit(SongsMutationTypes.SEARCH, value);
    }

    public set searchResult(value) {
        this.store.commit(SongsMutationTypes.SEARCH_RESULT, value);
    }

    public get searchResult() {
        return this.store.state.songs.searchResult;
    }

    public get Contributors() {
        return this.searchResult?.contributors ?? [];
    }

    public get Songs() {
        return this.searchResult?.songs ?? [];
    }

    // public get songsByCollection() {
    //     const collections: {
    //         collection: Collection;
    //         songs: Song[];
    //     }[] = [];

    //     for (const song of this.songs) {
    //         for (const co of song.collectionIds ?? []) {
    //             let col = collections.find(
    //                 (c) => c.collection.id == co,
    //             );
    //             if (!col) {
    //                 const collection = this.collections.find(
    //                     (c) => c.id == co,
    //                 );
    //                 if (collection) {
    //                     col = {
    //                         collection: collection,
    //                         songs: [],
    //                     };
    //                     collections.push(col);
    //                 }
    //             }
    //         }
    //     }
    //     return collections;
    // }

    public get collections(): Collection[] {
        return this.store.getters.collections;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public selectSong(collection: string, number: number) {
        this.$router.push({
            name: "song",
            params: {
                collection: collection,
                number: number,
            },
        });
    }
}
</script>
