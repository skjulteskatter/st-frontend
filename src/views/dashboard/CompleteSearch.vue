<template>
    <div class="complete-search">
        <div class="loader" v-if="loading"></div>
        <back-button />
        <h1>{{ $t("common.search") }}</h1>
        <search-input v-model="searchQuery" @search="search" />
        <div
            v-for="collection in songsByCollection"
            :key="collection.collection.id"
            class="complete-search__collection"
        >
            <h2>{{ collection.collection.getName(languageKey) }}</h2>
            <div class="complete-search__list complete-search__list-cards">
                <song-list-item-card
                    v-for="song in collection.songs.slice(0, 24)"
                    :key="song.id"
                    :song="song"
                    @click="selectSong(collection.collection.key, song.number)"
                >
                </song-list-item-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import api from "@/services/api";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import { Collection, Song } from "@/classes";

import { BaseButton, BackButton } from "@/components";
import { SongListItemCard } from "@/components/songs";
import { SearchInput } from "@/components/inputs";

@Options({
    components: {
        SongListItemCard,
        SearchInput,
        BaseButton,
        BackButton,
    },
})
export default class CompleteSearch extends Vue {
    public sessionStore = useStore(sessionKey);
    public loading = false;
    public searchQuery = "";
    public songs: SongInterface[] = [];

    public mounted() {
        if (this.$route.query.q) {
            this.searchQuery = this.$route.query.q?.toString() ?? "";
            this.search();
        }
    }

    public async search() {
        this.loading = true;
        console.log(this.searchQuery);
        if (this.searchQuery.length > 4) {
            this.songs = await api.songs.searchCollections(
                this.searchQuery,
                this.languageKey
            );
        }
        this.loading = false;
    }

    public get songsByCollection() {
        const collections: {
            collection: Collection;
            songs: Song[];
        }[] = [];

        for (const song of this.songs) {
            if (song.collection) {
                let col = collections.find(
                    (c) => c.collection.id == song.collection?.id
                );
                if (!col) {
                    const collection = this.collections.find(
                        (c) => c.id == song.collection?.id
                    );
                    if (collection) {
                        col = {
                            collection: collection,
                            songs: [],
                        };
                        collections.push(col);
                    }
                }
                col?.songs.push(new Song(song));
            }
        }
        return collections;
    }

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