<template>
    <div class="complete-search">
        <loader :loading="loading">
            <back-button />
            <h1>{{ $t("common.search") }}</h1>
            <search-input v-model="searchQuery" @search="search" class="complete-search__input" />
            <p class="complete-search__result-count">{{ searchResult.length + ' ' + $t('common.results').toLowerCase() }}</p>
            <div class="complete-search__list complete-search__list-cards">
                <search-result-item @click="goToSong(song)" v-for="song in searchResult" :key="song.id" :song="song"></search-result-item>
            </div>
        </loader>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton } from "@/components";
import { SearchInput, SearchResultItem } from "@/components/inputs";

import { songs } from "@/services/api";
import { Collection } from "@/classes";
import { IndexedSong } from "dmb-api";
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

<style lang="scss">
@import "../../style/mixins";

.complete-search {
    padding: calc(var(--st-spacing) * 2);
    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

    &__input {
        margin-bottom: var(--st-spacing);
    }

    &__result-count {
        opacity: .5;
    }

    &__collection {
        margin-top: 2rem;
    }

    &__list {

        &-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: var(--st-spacing);

            @include breakpoint("medium") {
                grid-template-columns: repeat(2, 1fr);
            }

            @include breakpoint("small") {
                grid-template-columns: 1fr;
            }
        }
    }
}
</style>
