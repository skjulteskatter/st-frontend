<template>
    <div class="complete-search">
        <loader :loading="loading">
            <back-button />
            <h1>{{ $t("common.search") }}</h1>
            <search-input v-model="searchQuery" @search="search" />
            <div class="complete-search__list complete-search__list-cards">
                <div v-for="song in songs" :key="song.id">
                    <small v-for="col in getCollections(song.collectionIds)" :key="col.id">{{col.getName(languageKey)}}</small>
                    <h3>{{song.number}} {{localeString(song.name)}}</h3>
                </div>
            </div>
            <!-- <div
                v-for="collection in songsByCollection"
                :key="collection.collection.id"
                class="complete-search__collection"
            >
                <h2>{{ collection.collection.getName(languageKey) }}</h2>
            </div> -->
        </loader>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton } from "@/components";
import { SongListItemCard } from "@/components/songs";
import { SearchInput } from "@/components/inputs";

import { songs } from "@/services/api";
import { Collection } from "@/classes";
import { IndexedSong } from "dmb-api";
import { useStore } from "@/store";

@Options({
    components: {
        SongListItemCard,
        SearchInput,
        BackButton,
    },
    name: "complete-search",
})
export default class CompleteSearch extends Vue {
    public sessionStore = useStore();
    public loading = false;
    public searchQuery = "";
    public songs: IndexedSong[] = [];

    public mounted() {
        if (this.$route.query.q) {
            this.searchQuery = this.$route.query.q?.toString() ?? "";
            this.search();
        }
    }

    public async search() {
        this.loading = true;
        if (this.searchQuery.length > 4) {
            this.songs = await songs.searchCollections(
                this.searchQuery,
            );
        }
        this.loading = false;
    }
    
    public localeString(name: LocaleString) {
        return name[this.languageKey] ?? name.en ?? Object.values(name)[0];
    }

    public getCollections(ids: string[]) {
        return this.collections.filter(c => ids.includes(c.id));
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
        return this.sessionStore.getters.collections;
    }

    public get languageKey() {
        return this.sessionStore.getters.languageKey;
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

    &__collection {
        margin-top: 2rem;
    }

    &__list {
        display: flex;
        flex-direction: column;

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
