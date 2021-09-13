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
                    {{ $t('store.buy') }}
                </base-button>
                <button aria-label="Toggle list type" title="Toggle list type" @click="toggleViewType" class="ml-auto text-gray-500 dark:text-white/50 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10">
                    <ViewGridIcon class="w-5 h-5" v-if="viewType == 'boards'" />
                    <ViewBoardsIcon class="w-5 h-5" v-else />
                </button>
            </div>
            <div class="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
                <div class="flex flex-col gap-1 text-sm">
                    <label for="song-category" class="text-gray-500 text-xs dark:text-gray-400">
                        {{ $t("song.sortby") }}
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
                        {{ $t("song.filterByContent") }}
                    </label>
                    <song-filter-dropdown />
                </div>
                <search-input
                    class="max-w-sm"
                    type="text"
                    :placeholder="$t('common.search')"
                    v-model="searchString"
                    @search="search"
                />
            </div>
            <loader :loading="loadingList" v-if="!loading && viewType == 'boards'">
                <div
                    class="song-list song-list__contributors"
                    v-if="listType == 'composer'"
                >
                    <song-list-card
                        :collection="collection"
                        v-for="ci in collection.composers"
                        :key="ci.item.id"
                        :songs="
                            filteredSongs.filter((s) =>
                                ci.songIds.includes(s.id)
                            )
                        "
                        :title="ci.item.name"
                        :action="() => gotoContributor(ci.item)"
                        class="mb-4"
                    ></song-list-card>
                </div>
                <div
                    class="song-list song-list__contributors"
                    v-if="listType == 'author'"
                >
                    <song-list-card
                        :collection="collection"
                        v-for="ci in collection.authors"
                        :key="ci.item.id"
                        :songs="
                            filteredSongs.filter((s) =>
                                ci.songIds.includes(s.id)
                            )
                        "
                        :title="ci.item.name"
                        :action="() => gotoContributor(ci.item)"
                        class="mb-4"
                    ></song-list-card>
                </div>
                <div
                    class="song-list song-list__songs"
                    v-if="listType == 'themes'"
                >
                    <song-list-card
                        v-for="theme in collection.themes"
                        :collection="collection"
                        :key="theme.item.id"
                        :songs="
                            filteredSongs.filter((s) =>
                                theme?.songIds.includes(s.id)
                            )
                        "
                        :title="theme?.name"
                        class="mb-4"
                    ></song-list-card>
                </div>
                <div
                    class="song-list song-list__songs"
                    v-if="listType == 'genre'"
                >
                    <song-list-card
                        v-for="i in collection.genres"
                        :collection="collection"
                        :key="i.item.id"
                        :songs="
                            filteredSongs.filter((s) =>
                                i?.songIds.includes(s.id)
                            )
                        "
                        :title="i?.name"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list song-list__songs"
                    v-if="listType == 'categories'"
                >
                    <song-list-card
                        v-for="i in collection.categories"
                        :collection="collection"
                        :key="i.item.id"
                        :songs="
                            filteredSongs.filter((s) =>
                                i?.songIds.includes(s.id)
                            )
                        "
                        :title="i?.name"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list song-list__songs"
                    v-if="listType == 'countries'"
                >
                    <song-list-card
                        v-for="country in collection.countries"
                        :collection="collection"
                        :key="country?.item.countryCode ?? Math.random()"
                        :songs="
                            filteredSongs.filter((s) =>
                                country?.songIds.includes(s.id)
                            )
                        "
                        :title="country?.name"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list song-list__songs"
                    v-if="listType == 'number' && songsByNumber.length"
                >
                    <song-list-card
                        v-for="s in songsByNumber"
                        :collection="collection"
                        :key="s?.title ?? Math.random()"
                        :songs="s?.songs ?? []"
                        :title="s?.title ?? ''"
                        :count="false"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list song-list__songs"
                    v-if="listType == 'title' && songsByTitle.length"
                >
                    <song-list-card
                        v-for="s in songsByTitle"
                        :collection="collection"
                        :key="s?.title ?? Math.random()"
                        :songs="s?.songs ?? []"
                        :title="s?.title ?? ''"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list song-list__songs"
                    v-if="listType == 'views' && songsByViews.length"
                >
                    <song-list-card
                        v-for="s in songsByViews"
                        :collection="collection"
                        :key="s?.title ?? Math.random()"
                        :songs="s?.songs ?? []"
                        :title="s?.title ?? ''"
                        :count="false"
                        class="mb-4"
                    ></song-list-card>
                </div>
            </loader>

            <div v-else-if="viewType == 'grid'" class="flex gap-2 flex-wrap">
                <button
                    v-for="s in songs"
                    :key="s?.id ?? Math.random()"
                    class="tracking-wide text-sm cursor-pointer shadow px-2 py-1 rounded-md hover:ring-2 hover:ring-gray-400 bg-white dark:bg-secondary flex-grow"
                    @click="s.view()"
                    aria-label="Open song"
                    title="Open song"
                >
                    {{ s.number }}
                </button>
            </div>

            <h1 class="opacity-50" v-if="!filteredSongs.length && !loading">
                No results
            </h1>
        </div>
    </loader>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CollectionItem, Song } from "@/classes";

import {
    SongListItemCard,
    SongListCard,
} from "@/components/songs";
import {
    ButtonGroup,
    SongFilterDropdown,
    SearchInput,
} from "@/components/inputs";
import { BackButton } from "@/components";
import { ShoppingCartIcon } from "@heroicons/vue/solid";
import { ApiContributor, Sort } from "dmb-api";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { appSession } from "@/services/session";
import { Country, Theme } from "@/classes/items";
import { ViewGridIcon, ViewBoardsIcon } from "@heroicons/vue/solid";

@Options({
    components: {
        SongListItemCard,
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
    private songsPerCard = 50;
    public viewType: "grid" | "boards" = "boards"

    public loadingList = false;

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
            if (!this.collection?.buttons.find((b) => b.value == this.listType)) {
                this.listType = "default";
            }
        }
    }

    public async mounted() {
        await this.loadCollection();
    }

    public updated() {
        if (this.$route.params.collection !== this.cId) {
            this.loadCollection();
        }
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

    public get songs() {
        return this.collection?.songs ?? [];
    }

    public get filteredSongs() {
        
        if (parseInt(this.searchString)) {
            return this.songs.filter(i => i.number.toString().includes(this.searchString));
        }
        return this.songs;
    }

    public get songsByNumber(): {
        title: string;
        songs: Song[];
    }[] {
        const songs: {
            title: string;
            songs: Song[];
        }[] = [];

        for (const song of this.filteredSongs) {
            const number = Math.floor((song.number - 1) / this.songsPerCard);

            songs[number] = songs[number] ?? {
                title: `${number * this.songsPerCard + 1}-${number * this.songsPerCard + this.songsPerCard}`,
                songs: [],
            };

            songs[number].songs.push(song);
        }
        return songs;
    }

    public get songsByViews(): {
        title: string;
        songs: Song[];
    }[] {
        const songs: {
            title: string;
            songs: Song[];
        }[] = [];
        const views = appSession.Views;

        const filteredSongs = this.filteredSongs.sort((a, b) => ((views[a.id] ?? 0) > (views[b.id] ?? 0)) ? -1 : 1);

        for (let i = 0; i < filteredSongs.length; i++) {
            const song = filteredSongs[i];

            const number = Math.floor((i)/this.songsPerCard);
            
            songs[number] = songs[number] ?? {
                title: `${number * this.songsPerCard + 1}-${number * this.songsPerCard + this.songsPerCard}`,
                songs: [],
            };

            songs[number].songs.push(song);
        }

        return songs;
    }

    public get songsByTitle(): {
        title: string;
        songs: Song[];
    }[] {
        const songs: {
            [key: string]: {
                title: string;
                songs: Song[];
            };
        } = {};

        for (const song of Object.assign([] as Song[], this.filteredSongs).sort((a, b) =>
            a.getName(this.languageKey) > b.getName(this.languageKey) ? 1 : -1,
        )) {
            const letter = song
                .getName(this.languageKey)
                ?.replace(/[\W]/g, "")[0]
                .toUpperCase();
            if (!letter) continue;

            songs[letter] = songs[letter] ?? {
                title: letter,
                songs: [],
            };

            songs[letter].songs.push(song);
        }

        return Object.keys(songs)
            .map((k) => songs[k])
            .sort((a, b) => (a.title > b.title ? 1 : -1));
    }

    public themeSongs(theme: CollectionItem<Theme>) {
        return this.filteredSongs.filter((s: Song) =>
            theme?.songIds.includes(s.id),
        );
    }

    public countrySongs(country: CollectionItem<Country>) {
        return this.filteredSongs.filter((s: Song) =>
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

    public async setListType(value: Sort) {
        if (this.collection && this.collection.listType !== value) {
            this.loadingList = true;
            await new Promise(r => setTimeout(r, 100));
            await this.collection.getList(value);
            this.loadingList = false;
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

    &__contributors {
        columns: 325px;
        column-gap: var(--st-spacing);
    }
    &__songs {
        columns: 325px;
        column-gap: var(--st-spacing);
    }
}

.song-list.faded {
    opacity: 0;
}
</style>
