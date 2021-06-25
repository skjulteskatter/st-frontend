<template>
    <loader :loading="loading">
        <div class="p-4 md:p-8" v-if="collection">
            <back-button class="md:hidden mb-4" />
            <div class="mb-4 flex flex-wrap gap-4 items-start md:items-center">
                <h1 class="font-bold text-2xl md:text-3xl">
                    {{ collection.name[languageKey] }}
                </h1>
                <base-button theme="secondary" icon="buy" @click="collection?.addToCart()" :disabled="collection.inCart" v-if="!collection.owned">{{ $t('store.buy') }}</base-button>
                <!-- <div class="flex justify-end flex-col md:flex-row md:gap-4 mb-4 text-sm md:ml-auto">
                    <span class="text-primary"><icon name="star" size="12" />{{$t("common.newMelody")}}</span>
                    <span class="text-green-700">{{$t("common.noSheetMusic")}}</span>
                    <span class="text-red-700">{{$t("common.notAvailableInThisLanguage")}}</span>
                </div> -->
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
            <div v-if="searchQuery == '' && !loading">
                <div
                    class="song-list__contributors"
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
                    class="song-list__contributors"
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
                    class="song-list__songs"
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
                        :title="theme?.item.name[languageKey] ?? ''"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__songs"
                    v-if="listType == 'tags'"
                >
                    <song-list-card
                        v-for="tag in collection.tags"
                        :collection="collection"
                        :key="tag.item.id"
                        :songs="
                            filteredSongs.filter((s) =>
                                tag?.songIds.includes(s.id)
                            )
                        "
                        :title="tag?.item.name ?? ''"
                        :class="{'border border-primary bg-yellow-50': tag.item.userDefined}"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__songs"
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
                        :title="country?.item.name[languageKey] ?? country?.item.name.en ?? Object.values(country?.item.name ?? {})?.[0] ?? ''"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__songs"
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
                    class="song-list__songs"
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
                    class="song-list__songs"
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
            </div>

            <h1 class="opacity-50" v-if="!filteredSongs.length && !loading">
                No results
            </h1>
        </div>
    </loader>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Collection, CollectionItem, Lyrics, Song } from "@/classes";

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
import { ApiContributor } from "dmb-api";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { appSession } from "@/services/session";

@Options({
    components: {
        SongListItemCard,
        SongListCard,
        ButtonGroup,
        SongFilterDropdown,
        BackButton,
        SearchInput,
    },
    name: "song-list",
})
export default class SongList extends Vue {
    private store = useStore();

    public searchQuery = "";
    public searchString = "";

    public cId = "";
    private songsPerCard = 50;

    public search() {
        this.store.commit(SongsMutationTypes.SEARCH, this.searchString);
        this.store.commit(SongsMutationTypes.SEARCH_RESULT, []);
        this.$router.push({
            name: "search",
        });
    }

    private async loadCollection() {
        this.cId = this.$route.params.collection as string;
        await this.store.dispatch(
            SongsActionTypes.SELECT_COLLECTION,
            this.$route.params.collection as string,
        );
        if (!this.buttons.find((b) => b.value == this.listType)) {
            this.listType = "default";
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
        return this.collection?.loading;
    }

    public set listType(value: string) {
        this.store.dispatch(SongsActionTypes.SET_LIST, value);
    }

    public get listType() {
        return this.store.state.songs.list;
    }

    public get allLyrics(): Lyrics[] {
        return this.store.getters.collection?.lyrics ?? [];
    }

    public get context() {
        return this.filteredObjects.context;
    }

    // Filtered songs. Returns all songs if no filters are applied.
    public get filteredObjects() {
        return (
            this.collection?.filteredSongs(
                this.searchQuery,
                this.store.state.songs.filter
            ) ?? {
                songs: [],
                context: {},
            }
        );
    }

    public get filteredSongs() {
        return this.filteredObjects.songs.sort((a, b) => a.number - b.number);
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get songs(): Song[] {
        return this.collection?.songs ?? [];
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

    public async setListType(value: string) {
        await this.store.dispatch(SongsActionTypes.SET_LIST, value);
    }

    public get buttons() {
        return [
            {
                label: this.$t("common.number"),
                value: "number",
                selected: this.listType == "number",
            },
            {
                label: this.$t("common.title"),
                value: "title",
                selected: this.listType == "title",
            },
            {
                label: this.$t("song.author"),
                value: "author",
                selected: this.listType == "author",
            },
            {
                label: this.$t("song.composer"),
                value: "composer",
                selected: this.listType == "composer",
            },
            // {
            //     label: this.$t("song.theme"),
            //     value: "themes",
            //     selected: this.listType == "themes",
            // },
            {
                label: this.$t("song.category"),
                value: "tags",
                selected: this.listType == "tags",
            },
            {
                label: this.$t("common.views"),
                value: "views",
                selected: this.listType == "views",
            },
            // {
            //     label: this.$t("common.country"),
            //     value: "countries",
            //     selected: this.listType == "countries",
            // },
        ].filter(
            (b) =>
                ![
                    !this.collection?.hasAuthors ? "author" : "",
                    !this.collection?.hasComposers ? "composer" : "",
                    !this.collection?.hasCountries ? "countries" : "",
                    !this.collection?.hasThemes ? "themes" : "",
                ].includes(b.value),
        );
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.song-list {
    &__contributors {
        columns: 325px;
        column-gap: var(--st-spacing);
    }
    &__songs {
        columns: 325px;
        column-gap: var(--st-spacing);
    }
}
</style>
