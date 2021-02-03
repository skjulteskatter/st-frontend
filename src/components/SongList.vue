<template>
    <div class="song-list" v-if="collection">
        <div class="loader" v-if="loading"></div>
        <div v-if="!loading">
            <div class="song-list__header">
                <h1>{{ $t("common.songs") }}</h1>
                <div style="display: flex; gap: var(--st-spacing)">
                    <base-button
                        theme="secondary"
                        @click="songListType = 'numbers'"
                        >Number</base-button
                    >
                    <base-button
                        theme="secondary"
                        @click="songListType = 'rows'"
                        >List</base-button
                    >
                    <base-button
                        theme="secondary"
                        @click="songListType = 'cards'"
                        >Cards</base-button
                    >
                    <input
                        type="text"
                        class="song-list__search"
                        placeholder="Search..."
                        v-model="searchQuery"
                    />
                </div>
            </div>

            <div class="song-list__contributors">
                <contributor-card
                    v-for="contributor in collection.authors"
                    :key="contributor.contributor.id"
                    :contributor-item="contributor"
                    type="author"
                ></contributor-card>
            </div>

            <!-- <div
                class="song-list__list song-list__list-numbers"
                v-if="filteredSongs.length && listType == 'numbers'"
            >
                <song-list-item-number
                    v-for="song in songs"
                    :key="song.id"
                    :song="song"
                    @click="selectSong(song.number)"
                ></song-list-item-number>
            </div> -->

            <h1 class="warning" v-if="!filteredNumbers.length">No results</h1>
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
    ContributorCard,
} from "@/components/SongList/index";

@Options({
    components: {
        BaseCard,
        BaseButton,
        SongListItemNumber,
        ContributorCard,
    },
})
export default class SongList extends Vue {
    private userStore = useStore(sessionKey);
    private songStore = useStore(songKey);
    public searchQuery = "";
    public store = useStore(songKey);
    public loading = false;
    public songListType = "numbers";

    public mounted() {
        this.songStore.dispatch(
            "selectCollection",
            this.$route.params.collection
        );
    }

    public get listType() {
        return this.songListType;
    }

    public get allLyrics(): Lyrics[] {
        return this.store.getters.collection?.lyrics ?? [];
    }

    public get filteredNumbers() {
        const numbers = this.songs
            .filter(
                (s) =>
                    s.number.toString() == this.searchQuery ||
                    s.rawContributorNames.includes(
                        this.searchQuery
                            .replace(/[^0-9a-zA-Z]/g, "")
                            .toLowerCase()
                    )
            )
            .map((s) => s.number);

        return (
            this.allLyrics
                ?.filter(
                    (l) =>
                        numbers.includes(l.number) ||
                        l.rawContent.includes(
                            this.searchQuery
                                .replace(/[^0-9a-zA-Z]/g, "")
                                .toLowerCase()
                        )
                )
                .map((l) => l.number) ?? []
        );
    }

    public get filteredSongs() {
        return this.songs.filter((s) =>
            this.filteredNumbers.includes(s.number)
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
        this.loading = true;
        if (this.collection) {
            this.$router.push({
                name: "song",
                params: {
                    collection: this.collection?.key,
                    number: number,
                },
            });
        }
        this.loading = false;
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

    &__contributors {
        columns: 300px;
        column-gap: var(--st-spacing);
    }

    &__list {
        display: flex;
        flex-direction: column;
        // gap: var(--st-half-spacing);

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
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--st-border-color);
        margin-bottom: var(--st-spacing);
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
