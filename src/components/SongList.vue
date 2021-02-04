<template>
    <div class="song-list" v-if="collection">
        <div class="loader" v-if="loading"></div>
        <div v-if="!loading">
            <div class="song-list__header">
                <h1 class="song-list__title">{{ $t("common.songs") }}</h1>
                <div style="display: flex; gap: var(--st-spacing)">
                    <base-button
                        theme="secondary"
                        @click="listType = 'default'"
                        >{{ $t("common.number") }}</base-button
                    >
                    <base-button
                        theme="secondary"
                        @click="listType = 'authors'"
                        >{{ $t("song.authors") }}</base-button
                    >
                    <base-button
                        theme="secondary"
                        @click="listType = 'composers'"
                        >{{ $t("song.composers") }}</base-button
                    >
                    <base-button
                        theme="secondary"
                        @click="listType = 'themes'"
                        >{{ $t("song.themes") }}</base-button
                    >
                    <input
                        type="text"
                        class="song-list__search"
                        placeholder="Search..."
                        v-model="searchQuery"
                        @keydown.enter="search"
                    />
                </div>
            </div>
            <hr />
            <div v-if="searchQuery == ''">
                <div
                    class="song-list__contributors"
                    v-if="listType == 'authors'"
                >
                    <contributor-card
                        v-for="contributor in collection.authors"
                        :key="contributor.contributor.id"
                        :contributor-item="contributor"
                        type="author"
                        :all-songs="filteredSongs"
                    ></contributor-card>
                </div>

                <div
                    class="song-list__contributors"
                    v-if="listType == 'composers'"
                >
                    <contributor-card
                        v-for="contributor in collection.composers"
                        :key="contributor.contributor.id"
                        :contributor-item="contributor"
                        type="author"
                        :all-songs="filteredSongs"
                    ></contributor-card>
                </div>

                <div
                    class="song-list__contributors"
                    v-if="listType == 'themes'"
                >
                    <theme-card
                        v-for="theme in collection.themes"
                        :key="theme.theme.id"
                        :theme-item="theme"
                        type="author"
                        :all-songs="filteredSongs"
                    ></theme-card>
                </div>

                <div
                    class="song-list__list song-list__list-numbers"
                    v-if="listType == 'default'"
                >
                    <song-list-item-number
                        v-for="song in filteredSongs"
                        :key="song.id"
                        :song="song"
                        @click="selectSong(song.number)"
                    ></song-list-item-number>
                </div>
            </div>

            <div class="song-list__list" v-if="searchQuery != ''">
                <song-list-item-row
                    v-for="song in filteredSongs.slice(0, 24)"
                    :key="song.id"
                    :song="song"
                    @click="selectSong(song.number)"
                >
                </song-list-item-row>
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
    SongListItemRow,
    ContributorCard,
    ThemeCard,
} from "@/components/songs";

@Options({
    components: {
        BaseCard,
        BaseButton,
        SongListItemNumber,
        ContributorCard,
        ThemeCard,
        SongListItemRow,
    },
})
export default class SongList extends Vue {
    private userStore = useStore(sessionKey);
    private songStore = useStore(songKey);
    private searchFilter = "";
    public searchQuery = "";
    public store = useStore(songKey);

    public mounted() {
        this.songStore.dispatch(
            "selectCollection",
            this.$route.params.collection
        );
    }

    public get loading() {
        return this.collection.loading;
    }

    public search() {
        this.searchFilter = this.searchQuery;
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

    public get filteredSongs() {
        return this.searchQuery
            ? this.collection.filteredSongs(this.searchQuery)
            : this.collection.songs;
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
    }

    &__search {
        display: block;
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
