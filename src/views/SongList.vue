<template>
    <loader :loading="loading">
        <div v-if="collection">
            <back-button class="mb-4" />
            <div class="mb-4 flex flex-wrap gap-4 items-start md:items-center">
                <h1 class="font-bold text-2xl md:text-3xl">
                    {{ collection.name[languageKey] }}
                </h1>
                <base-button theme="secondary" @click="collection?.addToCart()" :disabled="collection.inCart" v-if="!collection.available">
                    <template #icon>
                        <ShoppingCartIcon class="w-4 h-4" />
                    </template>
                    {{ $t('store_buy') }}
                </base-button>
                <button aria-label="Toggle list type" title="Toggle list type" @click="toggleViewType" class="ml-auto text-gray-500 dark:text-white/50 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10">
                    <ViewGridIcon class="w-5 h-5" v-if="viewType == 'boards'" />
                    <ViewBoardsIcon class="w-5 h-5" v-else />
                </button>
            </div>
            <div class="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
                <div class="flex flex-col gap-1 text-sm">
                    <label for="song-category" class="text-gray-500 text-xs dark:text-gray-400">
                        {{ $t("song_sortby") }}
                    </label>
                    <button-group
                        :buttons="buttons"
                        :action="setListType"
                        class="hidden md:flex"
                    ></button-group>
                    <select
                        class="p-2 bg-white border border-gray-300 rounded block md:hidden dark:bg-secondary dark:border-gray-500"
                        @input="setListType($event.target.value)"
                    >
                        <option
                            v-for="category in buttons"
                            :key="category.value"
                            :value="category.value"
                            :selected="category.value == listType"
                        >
                            {{ category.label }}
                        </option>
                    </select>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="song-filters" class="text-xs text-gray-500 dark:text-gray-400">
                        {{ $t("song_filterByContent") }}
                    </label>
                    <song-filter-dropdown
                        @apply="loadList" 
                    />
                </div>
                <search-input
                    class="max-w-sm"
                    type="text"
                    :placeholder="$t('common_search')"
                    v-model="searchString"
                    @search="search"
                />
            </div>
            <loader :loading="loadingList" v-if="!loading">
                <div
                    class="song-list song-list__items"
                    v-if="list?.length && viewType === 'boards'"
                >
                    <song-list-card
                        :collection="collection"
                        v-for="(e, i) in list"
                        :key="i"
                        :songs="e.songs"
                        :title="e.title"
                        :action="e.action"
                        :count="e.count"
                        class="mb-4"
                    ></song-list-card>
                </div>
                <div v-else-if="viewType == 'grid'" class="flex gap-2 flex-wrap">
                    <button
                        v-for="s in songs.sort((a, b) => a.number > b.number ? 1 : -1)"
                        :key="s?.id ?? Math.random()"
                        class="tracking-wide text-sm cursor-pointer shadow px-2 py-1 rounded-md hover:ring-2 hover:ring-gray-400 bg-white dark:bg-secondary flex-grow"
                        @click="s.view()"
                        aria-label="Open song"
                        title="Open song"
                    >
                        {{ s.number }}
                    </button>
                </div>
                <h1 class="opacity-50" v-if="!songs.length && !loading">
                    No results
                </h1>
            </loader>
        </div>
    </loader>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CollectionItem, ListEntry, Song } from "@/classes";

import { SongListCard } from "@/components/songs";
import {
    ButtonGroup,
    SongFilterDropdown,
    SearchInput,
} from "@/components/inputs";
import { BackButton } from "@/components";
import { ShoppingCartIcon } from "@heroicons/vue/solid";
import { ApiContributor, Sort } from "songtreasures";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { Country, Theme } from "@/classes/items";
import { ViewGridIcon, ViewBoardsIcon } from "@heroicons/vue/solid";

@Options({
    components: {
        SongListCard,
        ButtonGroup,
        SongFilterDropdown,
        BackButton,
        SearchInput,
        ShoppingCartIcon,
        ViewGridIcon,
        ViewBoardsIcon,
    },
    name: "song-list",
})
export default class SongList extends Vue {
    private store = useStore();

    public searchString = "";
    public cId = "";
    public list: ListEntry[] = [];
    public loadingList = false;

    public get searchNumber() {
        return this.searchString.replace(/[^0-9]/g, "");
    }

    public get songs() {
        return this.list.reduce((a, b) => [...a, ...b.songs], [] as Song[]);
    }

    public get viewType() {
        return this.collection?.viewType ?? "boards";
    }

    public set viewType(v) {
        if (this.collection)
            this.collection.viewType = v;
    }

    public get loading() {
        return this.collection?.loading === true;
    }
    
    public get buttons() {
        return this.collection?.buttons.map(i => {
            const r = Object.assign({}, i);
            r.label = this.$t(i.label);
            return r;
        }) ?? [];
    }

    public set listType(value: Sort) {
        if (this.collection)
            this.collection.listType = value;
    }

    public get listType() {
        return this.collection?.listType ?? "title";
    }

    public get collection() {
        return this.store.getters.collection;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public toggleViewType() {
        this.viewType = this.viewType === "boards" ? "grid" : "boards";
    }

    public search() {
        this.store.commit(SongsMutationTypes.SEARCH, this.searchString);
        this.store.commit(SongsMutationTypes.SEARCH_RESULT, undefined);
        this.$router.push({
            name: "search",
        });
    }

    private async loadCollection() {
        this.cId = this.$route.params.collection as string; 
        if (!this.collection?.getKeys().includes(this.cId)) {
            await this.store.dispatch(
                SongsActionTypes.SELECT_COLLECTION,
                this.$route.params.collection as string,
            );
        }
        await this.loadList();
    }

    public async mounted() {
        await this.loadCollection();
    }

    public updated() {
        if (this.$route.params.collection !== this.cId) {
            this.loadCollection();
        }
    }

    public async setListType(value: Sort) {
        if (this.listType !== value) {
            this.listType = value;
            await this.loadList();
        }
    }

    public async loadList() {
        this.loadingList = true;
        if (this.collection) {
            await new Promise(r => setTimeout(r, 100));
            this.collection.getList(this.listType);
            this.list = this.collection.Lists[this.listType](this.searchNumber);
        }
        this.loadingList = false;
    }

    public themeSongs(theme: CollectionItem<Theme>) {
        return this.songs.filter((s: Song) =>
            theme?.songIds.includes(s.id),
        );
    }

    public countrySongs(country: CollectionItem<Country>) {
        return this.songs.filter((s: Song) =>
            country?.songIds.includes(s.id),
        );
    }

    public gotoContributor(contributor: ApiContributor) {
        if (this.collection) {
            this.$router.push({
                name: "contributor",
                params: {
                    collection: this.collection.key,
                    contributor: contributor.id,
                },
            });
        }
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

@keyframes fade-in {
    0% {opacity: 0;}
    100% {opacity: unset;}
}

.song-list {
    animation: fade-in 0.1s linear;

    &__items {
        columns: 325px;
        column-gap: var(--st-spacing);
    }
}
</style>
