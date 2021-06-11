<template>
    <loader :loading="loading">
        <div class="p-4 md:p-8">
            <back-button />
            <h1 class="text-2xl md:text-3xl font-bold mb-4">{{ $t("common.search") }}</h1>
            <div class="flex flex-col gap-2 mb-4">
                <search-input v-model="searchQuery" @search="search" />
                <p class="text-gray-400">{{ searchResult.length + ' ' + $t('common.results').toLowerCase() }}</p>
            </div>
            <div class="mb-4" v-if="contributorResult.length">
                <h3 class="font-bold text-xl mb-2">{{ $t('song.contributor') }}</h3>
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <search-result-item @click="goToItem(item)" v-for="item in contributorResult" :key="item.id" :item="item"/>
                </div>
            </div>
            <div v-if="songResult.length">
                <h3 class="font-bold text-xl mb-2">{{ $t('common.songs') }}</h3>
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <search-result-item @click="goToItem(item)" v-for="item in songResult" :key="item.id" :item="item"/>
                </div>
            </div>
        </div>
    </loader>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton } from "@/components";
import { SearchInput, SearchResultItem } from "@/components/inputs";

import { songs } from "@/services/api";
import { Collection } from "@/classes";
import { IndexedContributor, IndexedSong } from "dmb-api";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";

@Options({
    components: {
        SearchInput,
        SearchResultItem,
        BackButton,
    },
    name: "complete-search",
})
export default class CompleteSearch extends Vue {
    public store = useStore();
    public loading = false;
    public songs: IndexedSong[] = [];

    public async mounted() {
        if (!this.searchResult.length) {
            await this.search();
        }
    }

    public get Songs() {
        return this.searchResult.filter(r => typeof(r.name) != "string") as IndexedSong[];
    }

    public get Contributors() {
        return this.searchResult.filter(r => typeof(r.name) == "string") as IndexedContributor[];
    }

    public async search() {
        this.loading = true;
        if (this.searchQuery) {
            const result = await songs.searchCollections(
                this.searchQuery,
            );

            this.searchResult = result;
        }
        this.loading = false;
    }
    
    public localeString(s: LocaleString) {
        return s[this.languageKey] ?? s.en ?? Object.values(s)[0];
    }

    public getCollections(ids: string[]) {
        return this.collections.filter(c => ids.includes(c.id));
    }

    public goToItem(item: IndexedSong | IndexedContributor) {
        if (typeof(item.name) == "string") {
            this.goToContributor(item as IndexedContributor);
        } else {
            this.goToSong(item as IndexedSong);
        }
    }

    public goToSong(song: IndexedSong) {
        const collections = this.collections.filter(c => song.collectionIds.includes(c.id));

        const cId = collections[0].key;
        this.$router.push({
            name: "song",
            params: {
                collection: cId,
                number: song.number,
            },
        });
    }

    public goToContributor(item: IndexedContributor) {
        this.$router.push({
            name: "contributor",
            params: {
                contributor: item.id,
            },
        });
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

    public get contributorResult() {
        const results = this.searchResult.filter(i => typeof(i?.name) == "string");
        return results;
    }

    public get songResult() {
        const results = this.searchResult.filter(i => typeof(i?.name) != "string");
        return results;
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
