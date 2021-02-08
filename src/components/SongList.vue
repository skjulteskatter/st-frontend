<template>
    <div class="song-list" v-if="collection">
        <div class="loader" v-if="loading"></div>
        <div v-if="!loading">
            <div class="song-list__header">
                <h1 class="song-list__title">{{ $t("common.songs") }}</h1>
                <div class="song-list__filters gap-x">
                    <div class="song-list__filters__fields gap-x">
                        <div class="song-list__filters__field">
                            <label for="song-category">{{
                                $t("song.category")
                            }}</label>
                            <button-group
                                :buttons="[
                                    {
                                        label: $t('common.number'),
                                        value: 'default',
                                        selected: listType == 'default',
                                    },
                                    {
                                        label: $t('common.title'),
                                        value: 'title',
                                        selected: listType == 'title',
                                    },
                                    {
                                        label: $t('song.authors'),
                                        value: 'authors',
                                        selected: listType == 'authors',
                                    },
                                    {
                                        label: $t('song.composers'),
                                        value: 'composers',
                                        selected: listType == 'composers',
                                    },
                                    {
                                        label: $t('song.themes'),
                                        value: 'themes',
                                        selected: listType == 'themes',
                                    },
                                    {
                                        label: $t('common.countries'),
                                        value: 'countries',
                                        selected: listType == 'countries',
                                    },
                                ]"
                                :action="setListType"
                            ></button-group>
                        </div>

                        <div class="song-list__filters__field">
                            <label for="song-filters">{{
                                $t("song.filters")
                            }}</label>
                            <song-filter-dropdown></song-filter-dropdown>
                        </div>
                    </div>
                    <input
                        type="text"
                        class="song-list__search"
                        :placeholder="$t('common.search')"
                        v-model="searchQuery"
                    />
                </div>
            </div>
            <hr />
            <div v-if="searchQuery == '' && !loading">
                <div
                    class="song-list__contributors"
                    v-if="listType == 'authors'"
                >
                    <song-list-card
                        v-for="author in collection.authors"
                        :key="author.contributor.id"
                        :songs="contributorSongs(author)"
                        :title="author.contributor.name"
                        :action="() => gotoContributor(author.contributor)"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__contributors"
                    v-if="listType == 'composers'"
                >
                    <song-list-card
                        v-for="composer in collection.composers"
                        :key="composer.contributor.id"
                        :songs="contributorSongs(composer)"
                        :title="composer.contributor.name"
                        :action="() => gotoContributor(composer.contributor)"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__contributors"
                    v-if="listType == 'themes'"
                >
                    <song-list-card
                        v-for="theme in collection.themes"
                        :key="theme.theme.id"
                        :songs="themeSongs(theme)"
                        :title="theme ? theme.theme.name[languageKey] : ''"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__contributors"
                    v-if="listType == 'countries'"
                >
                    <song-list-card
                        v-for="country in collection.countries"
                        :key="
                            country
                                ? country.country.countryCode
                                : Math.random()
                        "
                        :songs="country ? countrySongs(country) : []"
                        :title="country ? country.country.name : ''"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__contributors"
                    v-if="listType == 'default' && songsByNumber.length"
                >
                    <song-list-card
                        v-for="s in songsByNumber"
                        :key="s ? s.title : Math.random()"
                        :songs="s ? s.songs : []"
                        :title="s ? s.title : ''"
                        :count="false"
                    ></song-list-card>
                </div>

                <div
                    class="song-list__contributors"
                    v-if="listType == 'title' && songsByTitle.length"
                >
                    <song-list-card
                        v-for="s in songsByTitle"
                        :key="s ? s.title : Math.random()"
                        :songs="s ? s.songs : []"
                        :title="s ? s.title : ''"
                    ></song-list-card>
                </div>
            </div>

            <div
                class="song-list__list song-list__list-cards"
                v-if="searchQuery != ''"
            >
                <song-list-item-card
                    v-for="song in filteredSongs.slice(0, 24)"
                    :key="song.id"
                    :song="song"
                    @click="selectSong(song.number)"
                >
                </song-list-item-card>
            </div>

            <h1 class="warning" v-if="!filteredSongs.length">No results</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { Collection, Lyrics, Song } from "@/classes";

import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import {
    SongListItemNumber,
    SongListItemCard,
    SongListCard,
} from "@/components/songs";
import { ButtonGroup, SongFilterDropdown } from "@/components/inputs";

@Options({
    components: {
        BaseCard,
        BaseButton,
        SongListItemNumber,
        SongListItemCard,
        SongListCard,
        ButtonGroup,
        SongFilterDropdown,
    },
})
export default class SongList extends Vue {
    private userStore = useStore(sessionKey);
    private songStore = useStore(songKey);

    public themeFilter: string[] = []; // The ThemeID for the themes you want to filter on.
    public originFilter: string[] = []; // The OriginID for the origins you want to filter on.
    public audioFilter: string[] = []; // The Category for the audioFiles you want to filter on.
    public videoFilter: string[] = []; // The Category for the videoFiles you want to filter on.

    public searchQuery = "";
    public store = useStore(songKey);

    public async mounted() {
        await this.songStore.dispatch(
            "selectCollection",
            this.$route.params.collection
        );
    }

    public get loading() {
        return this.collection.loading;
    }

    public set listType(value: string) {
        this.store.commit("list", value);
    }

    public get listType() {
        return this.store.state.list;
    }

    public get allLyrics(): Lyrics[] {
        return this.store.getters.collection?.lyrics ?? [];
    }

    // Filtered songs. Returns all songs if no filters are applied.
    public get filteredSongs() {
        return this.collection.filteredSongs(
            this.searchQuery,
            this.themeFilter,
            this.originFilter,
            this.audioFilter,
            this.videoFilter
        );
    }

    public get collection(): Collection {
        return this.songStore.getters.collection;
    }

    public get languageKey() {
        return this.userStore.getters.languageKey;
    }

    public get selected() {
        return this.store.getters.song ?? {};
    }

    public async selectSong(number: number) {
        if (this.disabled.find((s) => s.number == number)) return;
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
        return this.songStore.getters.songs ?? [];
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

        for (const song of this.filteredSongs) {
            const letter = song.getName(this.languageKey)?.[0].toUpperCase();
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

    public themeSongs(theme: ThemeCollectionItem) {
        return this.filteredSongs.filter((s: Song) =>
            theme?.songIds.includes(s.id)
        );
    }

    public countrySongs(country: CountryCollectionItem) {
        return this.filteredSongs.filter((s: Song) =>
            country?.songIds.includes(s.id)
        );
    }

    public gotoContributor(contributor: ContributorInterface) {
        this.$router.push({
            name: "contributor",
            params: {
                collection: this.collection.key,
                contributor: contributor.id,
            },
        });
    }

    public setListType(value: string) {
        this.listType = value;
    }

    public contributorSongs(contributor: ContributorCollectionItem) {
        return this.filteredSongs.filter((s: Song) =>
            contributor?.songIds.includes(s.id)
        );
    }

    public get disabled() {
        return this.songs.filter((s) => !s.name[this.languageKey]);
    }
}
</script>

<style lang="scss">
.warning {
    opacity: 0.4;
}

.search__container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: var(--st-spacing);
}

.song-list {
    --st-half-spacing: calc(var(--st-spacing) * 0.5);
    animation: slideInFromBottom 0.3s ease;

    &__filters {
        display: flex;
        align-items: flex-end;

        &__fields {
            display: flex;
            align-items: flex-end;
        }

        &__field {
            display: flex;
            flex-direction: column;

            label {
                opacity: 0.5;
                font-size: 0.8em;
                margin-bottom: 0.2em;
            }
        }

        .selected {
            background: transparent;
        }
    }

    &__title {
        margin: 0;
    }

    &__contributors {
        columns: 300px;
        column-gap: var(--st-spacing);
    }

    &__list {
        display: flex;
        flex-direction: column;

        &-numbers {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
            grid-gap: var(--st-half-spacing);
        }

        &-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: var(--st-half-spacing);
        }
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        @media screen and (max-width: 600px) {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--st-spacing);
        }
    }

    &__search {
        width: 100%;
    }

    &__item {
        max-width: 52px;
        min-height: 40px;
        width: 100%;
        background-color: var(--st-background-color);
        border: 1px solid var(--st-border-color);
        border-radius: var(--st-border-radius);

        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;

        &.selected {
            border: 2px solid var(--st-primary-color);
        }

        &.disabled {
            color: var(--st-border-color);
            cursor: not-allowed;
        }
    }
}
</style>
