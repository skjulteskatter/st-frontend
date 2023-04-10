<template>
    <div>
        <Loader :loading="loading">
            <div v-if="collection">
                <BackButton class="mb-4" to="/collections" />
                <div class="mb-4 flex flex-wrap gap-4 items-start md:items-center">
                    <h1 class="font-bold text-2xl md:text-3xl">
                        {{ collection.name.default }}
                    </h1>
                    <BaseButton theme="secondary" @click="collection?.addToCart()" :disabled="inCart" v-if="!collection.available">
                        <template #icon>
                            <ShoppingCartIcon class="w-4 h-4" />
                        </template>
                        {{ $t('store_buy') }}
                    </BaseButton>
                    <BaseButton v-if="hasFiles" theme="neutral" @click="$router.push({name: 'collection-files', params: $route.params})">{{$t('collection_showFiles')}}</BaseButton>
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
                        <ButtonGroup
                            :buttons="buttons"
                            :action="setListType"
                            class="hidden md:flex"
                        />
                        <select
                            class="p-2 pr-6 bg-white border border-black/20 rounded-md block text-sm md:hidden dark:bg-secondary dark:border-white/20"
                            @input="setListType"
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
                    <div class="md:hidden">
                        <label for="song-filters" class="text-xs text-gray-500 dark:text-gray-400">
                            {{ $t("song_filterByContent") }}
                        </label>
                        <SongFilterSelect @apply="loadList" />
                    </div>
                    <div class="flex gap-2 items-stretch">
                        <SearchInput
                            class="md:max-w-xs"
                            type="text"
                            :placeholder="$t('common_search')"
                            v-model="searchString"
                            @search="search"
                            @keyup="filterByNumber"
                        />
                        <SongFilterDropdown :songs="collection.songs" @apply="loadList" class="hidden md:flex" />
                    </div>
                </div>
                <Loader :loading="loadingList" v-if="!loading">
                    <div
                        class="song-list columns-xs gap-4"
                        v-if="list?.length && viewType === 'boards'"
                    >
                        <SongListCard
                            :collection="collection"
                            v-for="(e, i) in list"
                            :key="i"
                            :songs="e.songs"
                            :title="e.title"
                            :action="e.action"
                            :count="e.count"
                            :isAdmin="isAdmin"
                            @showCta="showCta = true"
                            class="mb-4"
                         />
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
                </Loader>
            </div>
            <BaseModal
                :show="showCta"
                @close="closeCta"
            >
                <div class="flex flex-col gap-4 items-center">
                    <LockClosedIcon class="mt-2 w-16 h-16 text-primary" />
                    <span class="text-center">
                        <h3 class="font-bold text-xl">{{ $t('store_limitedAccess') }}</h3>
                        <p>{{ $t('store_gainAccess') }}</p>
                    </span>
                    <BaseButton theme="secondary" @click="closeCta">
                        <template #icon>
                            <CheckIcon class="w-4 h-4" />
                        </template>
                        OK
                    </BaseButton>
                </div>
            </BaseModal>
        </Loader>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Collection, CollectionItem, ListEntry, Song } from "@/classes";
import { SongListCard } from "@/components/songs";
import {
    ButtonGroup,
    SongFilterDropdown,
    SearchInput,
    SongFilterSelect,
} from "@/components/inputs";
import { BackButton, BaseModal } from "@/components";
import { 
    ShoppingCartIcon, 
    CheckIcon, 
    ViewGridIcon, 
    ViewBoardsIcon,
} from "@heroicons/vue/solid";
import { LockClosedIcon } from "@heroicons/vue/outline";
import type { ApiContributor, Sort } from "songtreasures-api";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { Country, Theme } from "@/classes/items";
import { appSession } from "@/services/session";

export default defineComponent({
    name: "song-list",
    components: {
    SongListCard,
    ButtonGroup,
    SongFilterDropdown,
    SongFilterSelect,
    BackButton,
    BaseModal,
    SearchInput,
    ShoppingCartIcon,
    CheckIcon,
    ViewGridIcon,
    ViewBoardsIcon,
    LockClosedIcon,
},
    data: () => ({
        store: useStore(),
        searchString: "",
        cId: "",
        list: [] as ListEntry[],
        loadingList: true,
        showCta: false,
        showFiles: false,
        inCart: false,
    }),
    computed: {
        isAdmin() {
            return this.store.getters.isAdmin;
        },
        hasFiles() {
            return appSession.files.some(f => this.songs.some(s => s.id === f.songId));
        },
        searchNumber() {
            return this.searchString.replace(/[^0-9]/g, "");
        },
        songs() {
            return this.list.reduce((a, b) => [...a, ...b.songs as Song[]], [] as Song[]);
        },
        viewType: {
            get() {
                return this.collection?.viewType ?? "boards";
            },
            set(v: "boards" | "grid") {
                if (this.collection)
                    this.collection.viewType = v;
            },
        },
        loading() {
            return this.collection?.loading === true;
        },
        buttons() {
            return this.collection?.buttons.map(i => {
                const r = Object.assign({}, i);
                r.label = this.$t(i.label);
                return r;
            }) ?? [];
        },
        listType: {
            get() {
                return this.collection?.listType ?? "title";
            },
            set(value: Sort) {
                if (this.collection)
                    this.collection.listType = value;
            },
        },
        collection() {
            return this.store.getters.collection as Collection;
        },
        languageKey() {
            return this.store.getters.languageKey;
        },
    },
    async mounted() {
        await this.loadCollection();
        // await this.loadFiles();
    },
    updated() {
        if (this.$route.params.collection !== this.cId) {
            this.loadCollection();
            // this.loadFiles();
        }
    },
    methods: {
        toggleViewType() {
            this.viewType = this.viewType === "boards" ? "grid" : "boards";
        },
        search() {
            this.store.commit(SongsMutationTypes.SEARCH, this.searchString);
            this.store.commit(SongsMutationTypes.SEARCH_RESULT, undefined);
            this.$router.push({
                name: "search",
            });
        },
        async loadCollection() {
            this.cId = this.$route.params.collection as string; 
            if (!this.collection?.getKeys().includes(this.cId)) {
                await this.store.dispatch(
                    SongsActionTypes.SELECT_COLLECTION,
                    this.$route.params.collection as string,
                );
            }
            this.inCart = await this.collection.inCart();
            await this.loadList();
        },
        async setListType(value: Sort) {
            if (this.listType !== value) {
                this.listType = value;
                this.searchString = "";
                await this.loadList();
            }
        },
        filterByNumber() {
            if(!this.collection) return;
            this.list = this.collection.Lists[this.listType](this.searchNumber);
        },
        async loadList() {
            this.loadingList = true;
            if (this.collection) {
                await new Promise(r => setTimeout(r, 1));
                this.collection.getList(this.listType);
                this.filterByNumber();
            }
            this.loadingList = false;
        },
        themeSongs(theme: CollectionItem<Theme>) {
            return this.songs.filter((s: Song) =>
                theme?.songIds.includes(s.id),
            );
        },
        countrySongs(country: CollectionItem<Country>) {
            return this.songs.filter((s: Song) =>
                country?.songIds.includes(s.id),
            );
        },
        gotoContributor(contributor: ApiContributor) {
            if (this.collection) {
                this.$router.push({
                    name: "contributor",
                    params: {
                        collection: this.collection.key,
                        contributor: contributor.id,
                    },
                });
            }
        },
        closeCta() {
            this.showCta = false;
        },
    },
});
</script>

<style lang="scss">
@keyframes fade-in {
    0% {opacity: 0;}
    100% {opacity: unset;}
}

.song-list {
    animation: fade-in 0.1s linear;
}
</style>
