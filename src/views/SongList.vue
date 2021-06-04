<template>
    <loader :loading="loading">
        <div class="p-4 md:p-8" v-if="collection">
            <back-button />
            <div class="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <h1 class="font-bold text-2xl md:text-3xl">
                    {{ collection.name[languageKey] }}
                </h1>
                <div class="flex justify-end flex-col md:flex-row md:gap-4 mb-4 text-sm">
                    <span class="text-primary"><icon name="star" size="12" />{{$t("common.newMelody")}}</span>
                    <span class="text-green-700">{{$t("common.noSheetMusic")}}</span>
                    <span class="text-red-700">{{$t("common.notAvailableInThisLanguage")}}</span>
                </div>
            </div>
            <div class="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
                <div class="flex flex-col gap-1 text-sm">
                    <label for="song-category" class="text-gray-500 text-xs">
                        {{ $t("song.sortby") }}
                    </label>
                    <button-group
                        :buttons="buttons"
                        :action="setListType"
                        class="hidden md:flex"
                    ></button-group>
                    <select
                        class="p-2 bg-white border border-gray-300 rounded block md:hidden"
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
                    <label for="song-filters" class="text-xs text-gray-500">
                        {{ $t("song.filter") }}
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
                    v-if="['composers', 'authors'].includes(listType)"
                >
                    <song-list-card
                        :collection="collection"
                        v-for="ci in collection.getContributors(listType)"
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
                    class="song-list__contributors"
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
                        :title="tag?.item.name[languageKey] ?? ''"
                        class="mb-4"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__contributors"
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
                    class="song-list__contributors"
                    v-if="listType == 'default' && songsByNumber.length"
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
                    class="song-list__contributors"
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
            </div>

            <div
                class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                v-if="searchQuery != ''"
            >
                <song-list-item-card
                    v-for="song in filteredSongs.slice(0, 24)"
                    :key="song.id"
                    :song="song"
                    :context="context[song.number]"
                    @click="selectSong(song.number)"
                >
                </song-list-item-card>
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

    public search() {
        this.searchQuery = this.searchString;
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

    public mounted() {
        this.loadCollection();
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

    public get selected() {
        return this.store.getters.song ?? {};
    }

    public async selectSong(number: number) {
        if (this.collection) {
            this.$router.push({
                name: "song",
                params: {
                    collection: this.collection?.key,
                    number: number,
                },
            });
        }
    }

    public get songs(): Song[] {
        return this.store.getters.songs ?? [];
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
            const number = Math.floor((song.number - 1) / 50);

            songs[number] = songs[number] ?? {
                title: `${number * 50 + 1}-${number * 50 + 50}`,
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
                value: "default",
                selected: this.listType == "default",
            },
            {
                label: this.$t("common.title"),
                value: "title",
                selected: this.listType == "title",
            },
            {
                label: this.$t("song.author"),
                value: "authors",
                selected: this.listType == "authors",
            },
            {
                label: this.$t("song.composer"),
                value: "composers",
                selected: this.listType == "composers",
            },
            {
                label: this.$t("song.theme"),
                value: "themes",
                selected: this.listType == "themes",
            },
            // {
            //     label: this.$t("song.tag"),
            //     value: "tags",
            //     selected: this.listType == "tags",
            // },
            {
                label: this.$t("common.country"),
                value: "countries",
                selected: this.listType == "countries",
            },
        ].filter(
            (b) =>
                ![
                    !this.collection?.hasAuthors ? "authors" : "",
                    !this.collection?.hasComposers ? "composers" : "",
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
}
</style>
